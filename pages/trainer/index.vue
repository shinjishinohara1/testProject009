<script setup>
const { data: trainers } = await useTrainers();
//const trainerList = trainers.map(({ Key }) => Key.replace(".json", ""));
//console.log("トレーナー情報", trainers)

// トレーナーの削除処理
// ★★★Todo：確認ダイアログが必要。後で実装
const delTrainer = async(name) => {
    console.log("トレーナー削除処理開始")
    const response = await $fetch(`api/trainer/${name}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    if (response) {
      router.push(`/trainer`);
      refreshNuxtData("trainers");
    } 
    //削除後にリフレッシュが必要。useTrainersをもう一度実行する事で更新。★もっとスマートなやり方あるかは後で調査。
    trainers = await useTrainers();
};
</script>




<template>
  <div>
    <h1>セーブデータ一覧</h1>
    <ul>
      <li v-for="trainer in trainers" :key="trainer">
        <!-- trainersオブジェクトで最初から.jsonを消すようにしたいが、なんか配列で受け取れないので一旦断念。 -->>
        <NuxtLink :to="`/trainer/${trainer.Key.replace('.json', '')}`">
          {{ trainer.Key.replace('.json', '') }}
        </NuxtLink>
        <!--<button>開始</button>-->
        ---
        <button @click="delTrainer(trainer.Key.replace('.json',''))">削除</button>
      </li>
    </ul>
    <NuxtLink to="/">戻る</NuxtLink>
  </div>
</template>
