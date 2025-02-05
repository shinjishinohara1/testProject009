<script setup>
//自分の所在地から不要なPathを削って作る。
const route = useRoute();
const trainerName = route.fullPath.replace(`/trainer/`, "");

const showDialog = ref(false);
const pokemonNames = ref([]);

//ポケモンの情報を取得
// APIからポケモンのリストを取得
const fetchPokemonList = async () => {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/");
        const data = await response.json();
        pokemonNames.value = data.results.map((pokemon) => pokemon.name);
    } catch (error) {
        console.error("ポケモンのデータ取得に失敗しました:", error);
    }
};
/*
ポケモンリストの戻り値はこんな感じ。
{
  "count": 1304,
  "next": "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20",
  "previous": null,
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
https://pokeapi.co/api/v2/pokemon/1/
にアクセスすると詳細な情報や画像が取れる。
▼画像(gifアニメ)。末尾の数字を返れば別のポケモンも表示出来そう。
"abilities".""generation-v""."black-white"."animated"."front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif",
*/


//ポケモンリストダイアログを表示する
const pokemonList = async () => {
    showDialog.value = true;
    // 新しくポケモンを捕まえる、でダイアログを表示
    await fetchPokemonList(); 
};

//ポケモンリストダイアログを閉じる
const closeDialog = () => {
    showDialog.value = false;
};
</script>

<template>
    <h1>{{ trainerName }}のステータス画面</h1>

    <!-- 不格好だがスタイルは後で検討。まずは最低限動くようにする。 -->
    <button @click="pokemonList">新しくポケモンを捕まえる</button>

    <!-- ダイアログ部分 -->
    <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog-content">
        <h2>ポケモン　リスト</h2>
        <ul>
            <li v-for="(name, index) in pokemonNames" :key="index">
              <!-- ★Todo：あとでここに絵をのせる。あと、捕まえるボタンも必要。 -->>
               {{ index + 1 }}.{{ name }}
            <br>------
            </li>
        </ul>
        <button @click="closeDialog">閉じる</button>
        </div>
    </div>

    <h1>手持ちポケモン</h1>
    <NuxtLink to="/trainer">戻る</NuxtLink>
</template>

<style scoped>
/* ダイアログのオーバーレイ */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ダイアログのスタイル */
.dialog-content {
  background: white;
  padding: 30px;
  width: 80vw;
  height: 80vh;
  max-width: 1000px;
  max-height: 700px;
  border-radius: 10px;
  text-align: center;
  overflow-y: auto;
}

/* リストのスタイル */
ul {
  list-style: none;
  padding: 0;
}

li {
  font-size: 1.2rem;
  margin: 5px 0;
}
</style>
