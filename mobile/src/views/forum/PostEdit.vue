<template>
  <div class="editPost-page">
    <MyHeader :title="id ? '编辑内容' : '发布帖子'" @clickRight="submit">
      {{ id ? "回复" : "发布" }}
    </MyHeader>
    <input
      v-show="false"
      class="submitFile"
      ref="submitFile"
      type="file"
      accept="image/jpeg,image/jpg,image/png"
      @change="uploadImage"
    />
    <!--富文本编辑器组件-->
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @change="onEditorChange($event)"
      @ready="onEditorReady($event)"
    >
    </quill-editor>
  </div>
</template>
<script>
// 引入富文本
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
import "quill/dist/quill.snow.css"; // 富文本编辑器外部引用样式  三种样式三选一引入即可
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import * as Quill from "quill"; // 富文本基于quill
import { MessageBox } from "mint-ui";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
  ["clean"], //清除字体样式
  ["image"] //上传图片、上传视频
];
import { mapGetters } from "vuex";
export default {
  props: {
    id: {} //要回复的ID
  },
  components: {
    quillEditor
  },
  async created() {
    if (!this.id) {
      this.content = localStorage.getItem("m_createPost")
        ? localStorage.getItem("m_createPost")
        : "";
      this.imgarr = localStorage.getItem("m_createPost_imgarr")
        ? JSON.parse(localStorage.getItem("m_createPost_imgarr"))
        : [];
    }
    if (this.id) {
      await this.fetchPost();
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    ...mapGetters(["getUserId"])
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector(".submitFile").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        },
        theme: "snow",
        placeholder: "尽情发挥吧！"
      },
      content: "",
      model: null,
      imgarr: []
    };
  },
  methods: {
    onEditorReady(editor) {},
    // 富文本编辑器 失去焦点事件
    onEditorBlur(editor) {},
    // 富文本编辑器 获得焦点事件
    onEditorFocus(editor) {},
    // 富文本编辑器 内容改变事件
    onEditorChange(editor) {},
    async uploadImage() {
      const formData = new FormData();
      formData.append("file", this.$refs.submitFile.files[0]);
      const res = await this.post("uploads", formData);
      const { url } = res;

      if (url) {
        let quill = this.$refs.myQuillEditor.quill;
        let length = quill.getSelection().index;
        quill.insertEmbed(length, "image", url);
        quill.setSelection(length + 1);
        this.imgarr.push(url.split("/").pop());
      } else {
        this.AlertError("上传失败");
      }
    },
    async submit() {
      if (this.content != "" && this.getUserId) {
        let res;
        if (this.id) {
          // 获取楼层
          const layer = await this.fetch(`/posts/layer/${this.id}`);
          //回帖
          res = await this.post("/rest/posts", {
            parent: this.id,
            layer: layer + 1,
            user: this.getUserId,
            content: this.content,
            imgarr: this.imgarr
          });
        } else {
          // 主贴
          res = await this.post("/rest/posts", {
            user: this.getUserId,
            content: this.content,
            imgarr: this.imgarr
          });
          localStorage.removeItem("m_createPost");
        }
        if (res) {
          this.content = "";
          this.AlertSuccess(this.id ? "回复成功" : "发布成功");
          setTimeout(() => {
            this.routeBack();
          }, 1500);
        }
      }
    },
    async removeTempImgs() {
      if (this.imgarr.length > 0) {
        const config = {
          data: { imgarr: this.imgarr }
        };
        await this.$http.delete("storage", config);
      }
    },
    async fetchPost() {
      this.model = await this.fetch(`rest/posts/${this.id}`, {
        populate: {
          path: "user"
        }
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.content != "" && !this.id) {
      const content = this.content;
      const imgarr = JSON.stringify(this.imgarr);
      MessageBox.confirm("", {
        message: "是否保存帖子草稿",
        title: "友情提示",
        confirmButtonText: "保存",
        cancelButtonText: "取消"
      })
        .then(action => {
          if (action == "confirm") {
            localStorage.setItem("m_createPost", content);
            localStorage.setItem("m_createPost_imgarr", imgarr);
            next();
          }
        })
        .catch(err => {
          if (err == "cancel") {
            this.removeTempImgs();
            localStorage.removeItem("m_createPost");
            localStorage.removeItem("m_createPost_imgarr");
            next();
          }
        });
    } else {
      next();
    }
  }
};
</script>
<style lang="scss">
.editPost-page {
  .submitFile {
    opacity: 0;
  }
}
</style>
