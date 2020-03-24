<template>
  <div>
    <el-form
      style="width:50%;"
      label-width="100px"
      @submit.native.prevent="save"
      v-if="model"
    >
      <h1>{{ id ? "编辑" : "添加" }}网球视频</h1>
      <el-form-item label="视频标题">
        <el-input type="text" v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="发布者">
        <el-input type="text" v-model="model.author"></el-input>
      </el-form-item>
      <el-form-item label="封面图">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/uploads'"
          :header="setAutoHeader()"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="model.cover" :src="model.cover" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="视频上传" prop="url">
        <el-upload
          class="avatar-uploader el-upload--text"
          :action="$http.defaults.baseURL + '/uploads/video'"
          :header="setAutoHeader()"
          :show-file-list="false"
          :on-success="handleVideoSuccess"
          :before-upload="beforeUploadVideo"
          :on-progress="uploadVideoProcess"
        >
          <video
            v-if="model.url != '' && videoFlag == false"
            :src="model.url"
            class="avatar"
            controls="controls"
          >
            您的浏览器不支持视频播放
          </video>
          <i
            v-else-if="model.url == '' && videoFlag == false"
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>
        <P class="text">请保证视频格式正确，且不超过700M</P>

        <!-- <el-progress
          v-if="videoFlag == true"
          type="circle"
          :percentage="videoUploadPercent"
          style="margin-top:30px;"
        ></el-progress> -->
      </el-form-item>
      <el-form-item label="标签">
        <el-input
          type="text"
          v-model="model.label"
          placeholder="不超过6个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="text" v-model="model.intro"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">{{
          id ? "保存" : "发布"
        }}</el-button>
        <el-button type="danger" @click.prevent="$router.back()"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    id: {}
  },
  created() {
    if (this.id) {
      this.fetch();
    }
  },
  data() {
    return {
      model: {
        title: "",
        url: ""
      },
      videoFlag: false
    };
  },
  methods: {
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 700;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过300MB哦!");
        return false;
      }
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      console.log(file);
      // this.videoUploadPercent = file.percentage.toFixed(0);
    },
    handleVideoSuccess(res, file) {
      //获取上传图片地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      if (res) {
        this.model.videoUploadId = res.filename;
        this.model.url = res.url;
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
    },
    handleAvatarSuccess(res) {
      this.$set(this.model, "cover", res.url);
    },
    async fetch() {
      const res = await this.$http.get(`rest/videos/${this.id}`);
      this.model = res.data;
    },
    async save() {
      if (this.model.label.length > 6) {
        this.$message({
          message: "标签超过6个字符，请更改",
          type: "error"
        });
        return;
      }
      if (this.id) {
        await this.$http.put(`rest/videos/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/videos", this.model);
      }
      this.$message({
        message: `${this.id ? "修改" : "新建"}成功`,
        type: "success"
      });
      this.$router.push({
        name: "videoList"
      });
    }
  }
};
</script>
