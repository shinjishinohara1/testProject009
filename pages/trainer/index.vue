<script setup>
const { data: trainers } = await useTrainers();

// トレーナーの削除処理
const delTrainer = async(key) => {
    console.log("トレーナー削除処理開始")
    const response = await $fetch(`/trainer/${key}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    if (response) {
      router.push(`/trainer`);
    } 
};


</script>

<template>
  <div>
    <h1>セーブデータ一覧</h1>
    <ul>
        <li v-for="trainer in trainers" :key="trainer">
        <!-- <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>-->
        {{ trainer.Key.replace('.json', '') }}<br>
        <button>開始</button> ---
        <button @click="delTrainer(trainer.Key)">削除</button>
      </li>
    </ul>
    <NuxtLink to="/">戻る</NuxtLink>
  </div>
</template>
