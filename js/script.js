// =================================
// タイトル画面
// =================================

const titleBgm =
    document.getElementById("title-bgm");

const selectSE =
    new Audio("assets/se/title.mp3");

const nextSE =
    new Audio("assets/se/pi.mp3");


// =================================
// ストーリーフラグ
// =================================

window.storyFlags = {};


// =================================
// 音量
// =================================

selectSE.volume = 0.7;
nextSE.volume = 0.5;


// =================================
// ストーリーBGM
// =================================

const storyBgm =
    document.getElementById("story-bgm");

let currentBgm = "";

function changeBGM(path) {

    if (currentBgm === path) {
        return;
    }

    currentBgm = path;

    storyBgm.pause();
    storyBgm.currentTime = 0;
    storyBgm.src = path;

    storyBgm.play().catch(error => {
        console.log("BGM再生待機中");
    });

}


// =================================
// タイトルBGM
// =================================

if (titleBgm) {

    document.addEventListener(
        "click",

        () => {

            titleBgm.volume = 0.5;
            titleBgm.play();

        },

        { once: true }
    );

}


// =================================
// メッセージ表示
// =================================

function showMessage(message) {
    alert(message);
}


// =================================
// タイトルSE
// =================================

function playSelectSE() {

    selectSE.currentTime = 0;
    selectSE.play();

}


// =================================
// ゲーム開始
// =================================

function startGame() {

    setTimeout(() => {

        window.location.href =
            "story.html";

    }, 300);

}


// =================================
// ストーリー画面
// =================================

const storyScreen =
    document.getElementById("story-screen");


// story.htmlにいる場合だけ実行

if (storyScreen) {


    // =================================
    // HTML取得
    // =================================

    const textElement =
        document.getElementById(
            "narration-text"
        );

    const choicesElement =
        document.getElementById(
            "choices"
        );

    const speakerName =
        document.getElementById(
            "speaker-name"
        );

    const characterLayer =
        document.getElementById(
            "character-layer"
        );

    const logButton =
        document.getElementById(
            "log-button"
        );

    const logWindow =
        document.getElementById(
            "log-window"
        );

    const logClose =
        document.getElementById(
            "log-close"
        );

    const logContent =
        document.getElementById(
            "log-content"
        );


    // =================================
    // ログ
    // =================================

    let storyLog = [];


    function addLog(scene) {

        if (!scene.text) return;


        storyLog.push({

            name:
                scene.name || "",

            text:
                scene.text

        });


        // ログを更新

        logContent.innerHTML = "";


        storyLog.forEach(entry => {

            const div =
                document.createElement("div");


            div.className =
                "log-entry";


            if (entry.name) {

                div.innerHTML =
                    `<span class="log-name">
                        ${entry.name}
                    </span>
                    ${entry.text}`;

            }

            else {

                div.textContent =
                    entry.text;

            }


            logContent.appendChild(div);

        });


        // 一番下までスクロール

        logContent.scrollTop =
            logContent.scrollHeight;

    }


    // =================================
    // ログボタン
    // =================================

    logButton.addEventListener(
        "click",

        event => {

            event.stopPropagation();

            logWindow.style.display =
                "flex";

        }
    );


    // =================================
    // ログを閉じる
    // =================================

    logClose.addEventListener(
        "click",

        event => {

            event.stopPropagation();

            logWindow.style.display =
                "none";

        }
    );


    // =================================
    // 状態
    // =================================

    let currentIndex = 0;

    let textIndex = 0;

    let isTyping = false;


    // =================================
    // 現在のシーン取得
    // =================================

    function getCurrentScene() {

        return scenario[currentIndex];

    }


    // =================================
    // キャラクター表示
    // =================================

    function showCharacters(characters) {


        // 今まで表示されていたキャラクター

        const oldCharacters =
            Array.from(
                characterLayer.children
            );


        const oldCharactersData =
            oldCharacters.map(img => ({

                id:
                    img.dataset.characterId,

                src:
                    img.dataset.characterSrc

            }));


        const count =
            characters.length;


        // 一旦、現在のキャラクターを削除

        characterLayer.innerHTML = "";


        characters.forEach(
            (character, index) => {


                const img =
                    document.createElement("img");


                img.src =
                    character.src;


                img.className =
                    "story-character";


                img.dataset.characterId =
                    character.id;


                img.dataset.characterSrc =
                    character.src;


                // =================================
                // 新しく登場したキャラか？
                // =================================

                const oldCharacter =
                    oldCharactersData.find(
                        old =>
                            old.id ===
                            character.id
                    );


                if (!oldCharacter) {

                    // 完全に新しく登場したキャラ

                    img.classList.add(
                        "fade-in"
                    );

                }


                // =================================
                // 位置
                // =================================

                if (count === 1) {

                    img.style.left =
                        "50%";

                }

                else if (count === 2) {

                    if (index === 0) {

                        img.style.left =
                            "30%";

                    }

                    else {

                        img.style.left =
                            "70%";

                    }

                }

                else if (count === 3) {

                    if (index === 0) {

                        img.style.left =
                            "20%";

                    }

                    else if (index === 1) {

                        img.style.left =
                            "50%";

                    }

                    else {

                        img.style.left =
                            "80%";

                    }

                }

                else {

                    const position =
                        15 +
                        (70 / (count - 1)) *
                        index;


                    img.style.left =
                        position + "%";

                }


                characterLayer.appendChild(
                    img
                );

            }
        );

    }


    // =================================
    // 文章表示
    // =================================

    function showText(scene) {

        isTyping = true;

        textIndex = 0;

        textElement.textContent = "";


        addLog(scene);


        // =================================
        // 名前表示
        // =================================

        if (scene.name) {

            speakerName.textContent =
                scene.name;

            speakerName.style.display =
                "block";

        }

        else {

            speakerName.textContent = "";

            speakerName.style.display =
                "none";

        }


        // =================================
        // セリフ切り替えSE
        // =================================

        nextSE.currentTime = 0;

        nextSE.play();


        // =================================
        // 特定のセリフ専用SE
        // =================================

        if (scene.se) {

            const sceneSE =
                new Audio(scene.se);

            sceneSE.volume = 0.7;

            sceneSE.play();

        }


        // =================================
        // タイピング
        // =================================

        function type() {

            if (
                textIndex <
                scene.text.length
            ) {

                textElement.textContent +=
                    scene.text[textIndex];

                textIndex++;


                setTimeout(
                    type,
                    15
                );

            }

            else {

                isTyping = false;

            }

        }


        type();

    }


    // =================================
    // 選択肢表示
    // =================================

    function showChoices(scene) {

        choicesElement.innerHTML = "";


        choicesElement.style.opacity =
            "1";

        choicesElement.style.pointerEvents =
            "auto";


        // choicesが存在しない場合

        if (!scene.choices) {

            console.error(
                "このchoiceシーンにchoicesがありません:",
                scene
            );

            return;

        }


        scene.choices.forEach(
            choice => {


                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "choice-button";


                button.textContent =
                    choice.text;


                // =================================
                // 選択肢クリック
                // =================================

                button.addEventListener(
                    "click",

                    event => {


                        // ストーリー画面のクリックを止める

                        event.stopPropagation();


                        // 選択肢を消す

                        choicesElement.style.opacity =
                            "0";

                        choicesElement.style.pointerEvents =
                            "none";


                        // =================================
                        // 次のIDを探す
                        // =================================

                        const nextIndex =
                            scenario.findIndex(
                                scene =>
                                    scene.id ===
                                    choice.next
                            );


                        if (
                            nextIndex !== -1
                        ) {

                            currentIndex =
                                nextIndex;


                            playScene();

                        }

                    }
                );


                choicesElement.appendChild(
                    button
                );

            }
        );

    }


    // =================================
    // シーン再生
    // =================================

    function playScene() {

        const scene =
            getCurrentScene();


        // =================================
        // BGM変更
        // =================================

        if (scene.bgm) {

            changeBGM(
                scene.bgm
            );

        }


        // =================================
        // 背景変更
        // =================================

        if (scene.background) {

            storyScreen.style.backgroundImage =
                `url("${scene.background}")`;

        }


        // =================================
        // キャラクター変更
        // =================================

        if (scene.characters) {

            showCharacters(
                scene.characters
            );

        }


        // =================================
        // キャラクター振動
        // =================================

        if (scene.shake) {

            const shakeCharacter =
                characterLayer.querySelector(
                    `[data-character-id="${scene.shake}"]`
                );


            if (shakeCharacter) {

                shakeCharacter.classList.remove(
                    "shake"
                );


                // アニメーションを確実に再発火

                void shakeCharacter.offsetWidth;


                shakeCharacter.classList.add(
                    "shake"
                );

            }

        }


        // =================================
        // キャラクター縦振動
        // =================================

        if (scene.shakeVertical) {

            const shakeCharacter =
                characterLayer.querySelector(
                    `[data-character-id="${scene.shakeVertical}"]`
                );


            if (shakeCharacter) {

                shakeCharacter.classList.add(
                    "shake-vertical"
                );

            }

        }


        // =================================
        // 選択肢を一旦消す
        // =================================

        choicesElement.style.opacity =
            "0";

        choicesElement.style.pointerEvents =
            "none";


        // =================================
        // 文章
        // =================================

        if (scene.type === "text") {

            showText(scene);

        }


        // =================================
        // 選択肢
        // =================================

        else if (
            scene.type === "choice"
        ) {

            showChoices(scene);

        }

    }


    // =================================
    // 画面クリック
    // =================================

    storyScreen.addEventListener(
        "click",

        () => {


            // =================================
            // 選択肢表示中
            // =================================

            if (
                choicesElement.style.pointerEvents ===
                "auto"
            ) {

                return;

            }


            // =================================
            // タイピング中
            // =================================

            if (isTyping) {

                const scene =
                    getCurrentScene();


                textElement.textContent =
                    scene.text;


                textIndex =
                    scene.text.length;


                isTyping =
                    false;


                return;

            }


            // =================================
            // 次のシーン
            // =================================
// =================================
// 次のシーン
// =================================

currentIndex++;


// =================================
// 最後まで行った場合
// =================================

if (
    currentIndex >=
    scenario.length
) {

    window.location.href =
        "index.html";

    return;

}


// =================================
// 次のシーンを再生
// =================================

playScene();

        }
    );


    // =================================
    // ゲーム開始
    // =================================

    playScene();

}