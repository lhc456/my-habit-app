<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
/* 全局样式 - 马卡龙色系主题 */
@import 'wot-design-uni/style.css';

page {
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

/* 马卡龙主题色 */
:root {
  /* 主色调 - 治愈绿 */
  --wd-color-primary: #7ec699;
  
  /* 马卡龙色系 */
  --macaron-pink: #ffb6c1;
  --macaron-purple: #c4b5fd;
  --macaron-blue: #a8d8d8;
  --macaron-yellow: #f9e5b5;
  --macaron-green: #a8d8c9;
  --macaron-orange: #ffd6a5;
  
  /* 辅助色 */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-placeholder: #999999;
  
  /* 背景色 */
  --bg-color: #ffffff;
  --bg-color-grey: #f5f5f5;
  
  /* 圆角 */
  --radius-sm: 8rpx;
  --radius-md: 16rpx;
  --radius-lg: 24rpx;
  --radius-circle: 50%;
}
</style>
