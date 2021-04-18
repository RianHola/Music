<template>
  <div class="login-logo">
    <svg class="icon">
      <use xlink:href="#icon-erji"></use>
    </svg>
  </div>
</template>
<script>
export default {
  name: "login-logo",
};
</script>

<style lang="scss" scoped>
.login-logo {
  height: 80vh;
  margin-bottom: 30vh;
  width: 50vw;
  min-width: 650px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: row;
  flex-wrap: nowrap;
}
.icon {
  margin-left: 20em;
  margin-top: 10em;
  transform: rotate(-30deg);
}
</style>