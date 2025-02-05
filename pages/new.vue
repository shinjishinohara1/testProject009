<script setup>
const name = ref('');
const showDialog = ref(false);

// 決定でダイアログを出す
const saveName = () => {
  showDialog.value = true;
};

// 名前が合ってたら、Jsonファイルを保存する
const confirmName = async () => {
  // JSON保存処理。他を呼ぶ形にする
  try {
    const response = await $fetch("/api/trainer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { name: name.value },
    });
    if (response) {
      router.push(`/trainer/${name.value}`);
    }
  } catch ( error ) {
    console.log("JSON保存のAPI実行に失敗", error)
  };

  // ダイアログを閉じる
  showDialog.value = false;
};



</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>では　はじめに　きみの　なまえを　おしえて　もらおう！</p>
    <form @submit.prevent="saveName">
      <div class="item">
        <label for="name">なまえ</label>
        <input id="name" v-model="name" type="text" required />
      </div>
      <button type="submit">決定</button>
    </form>

    <div v-if="showDialog" class="dialog">
      <p>ふむ　きみは　{{ name }}　さん　というんだな！</p>
      <!-- はいを押したらconfirmName関数を呼ぶ。ダイアログはそちらで閉じる。 -->
      <button @click="confirmName">はい</button>
      <button @click="showDialog = false">いいえ</button>
    </div>
    <NuxtLink to="/">戻る</NuxtLink>
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}

/* ダイアログのスタイル */
.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1.5rem;
  border: solid 2px #555;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.dialog button {
  margin: 0.5rem;
}
</style>
