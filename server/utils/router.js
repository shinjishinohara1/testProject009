import { Router } from "express";
import { findTrainers, upsertTrainer } from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World");
});

/** トレーナー名の一覧の取得 */
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    // TODO: 期待するレスポンスボディに変更する
    res.send(trainers);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post("/trainer", async (req, res, next) => {
  try {
    // TODO: リクエストボディにトレーナー名が含まれていなければ400を返す
    console.log("トレーナー追加自のリクエストボディ：", req.body);
    if (!("name" in req.body)) {
      console.log("400");
      return res.sendStatus(400);
    };
    // TODO: すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    // trainers関数を使って受け取る
    const trainers = await findTrainers();
    // sameはtrainersに1つでも同じものが含まれればTrueを返す。
    if (trainers.some(({ Key }) => Key === `${req.body.name}.json`)) {
      console.log("409");
      return res.sendStatus(409);
    };
    // S3に保存
    console.log("トレーナー名.JSONをS3に保存開始。");
    const result = await upsertTrainer(req.body.name, req.body);
    console.log("トレーナー名.JSONをS3に保存した結果:", result);

    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    console.log("トレーナー保存エラー:", err);
    next(err);
  }
});

/** トレーナーの取得 */
// TODO: トレーナーを取得する API エンドポイントの実装

/** トレーナーの更新 */
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});



/** トレーナーの削除 */
// TODO: トレーナーを削除する API エンドポイントの実装
// ★delTrainerを呼ぶ
router.delete("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const result = await delTrainer(trainerName);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});



/** ポケモンの追加 */
router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: リクエストボディにポケモン名が含まれていなければ400を返す
    const pokemon = await findPokemon(req.body.name);
    // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
    const result = await upsertTrainer(trainerName, { pokemons: [pokemon] });
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの削除 */
// TODO: ポケモンを削除する API エンドポイントの実装

export default router;
