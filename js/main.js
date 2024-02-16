'use strict';
// 先頭に文字列のuse strictとすることで潜在的なバグを減らす

// Javascriptは関数スコープのため
// 変数や関数を外から見えなくするたまに(カプセル化・プライベート化)
//即時関数でスコープを閉じながら関数内の処理をすぐに実行する
(()=> {
    // 手の形で数を表現。それぞれの数値はHTMLのbuttonタグ内のvalue属性で定義している。
    // value="1"=>グー
    // value="2" =>チョキ
    // value="3" =>パー
    const HAND_FORMS = [
        0,
        // パー
        1,
        // グー
        2,
        // チョき
    ];

    //images/sprite.png(グーチョキパーのが像)を切り取って使う際に
    //それぞれの手のx座標を指定している 
    const HAND_X = [
        0,
        // グー
        380,
        // チョキ
        750
        // パー
    ];
    // images/sprite.ong(グーチョキパーの画像)を切り取って使う際に
    //  それぞれの手のwidth(横幅)を指定している。
    const HAND_WIDTH = [
        360,
        //グー
        340,
        // チョキ
        430
        // パー
    ];
    // それぞれの手の固いの画像を切り出したいときは
    // グー軸が0pxから横幅360px切り出した範囲
    // チョキ:z軸が380pz～横幅340pxを切り出した範囲
    // パーx軸は750pxから横幅430pxを切り出した範囲

    const IMAGE_PATH = './img/sprite.png';
    //1秒間で60駒（フレームアニメーションを行う
    // ここの値が大きいと手の変わりスピードが速くなる
    // 例
    // FPSの値が1:1秒間に１回手が切り替わる
    // FPSの値が10:１秒に１0回手が切り替わる
    // FPSの値が60:１秒に60回手が切り替わる
    const FPS = 10;

    // loop関数内で呼び出しているdraw関数の実行をするかしないかを切り分けているフラグ
    // グーチョキパーのいずれかのボタンが押されたときにtrueになる（onclick関数を参照)

    let isPause = false;

    //draw関数が実行されるたびに１増える（インクリメント)
    // currentFrameの値を剰余演算子(%)を使いだた余りをつかうことで
    //  表示される手の形を決める
    // 今回の場合は手の形は３つ(HAND_FORMS.kength)なので
    // 値は必ず0.1.2のいずれかになる
    // 例
    // currentFrameが30０の時:30%%3=>0=>HAND_FORMS[0]=>グー
    // currentFrameが31の時:30%%3=>1=>HAND_FORMS[0]=チョキ
    // currentFrameが32の時:30%%3=>0=>HAND_FORMS[0]=>パー
    let currentFrame = 0;

    /**
     * 実際にアニメーションを開始させる処理
     */
    function main() {
        const canvas = document.getElementById('screen');
        const context = canvas.getContext('2d');
        const imgObj = new Image();
        currentFrame = 0;

        // 画像('.img/sprite.png)の読み込みが完了したら、
        //loop巻子の無限ループを実行する
        imgObj.onload = function () {
            function loop() {
                if (!isPause) {
                    draw(canvas, context, imgObj, currentFrame++);
                }

                //指定した時間が経過したらloop関数を呼び出す
                // 関数自信を呼び出す関数のことを再帰関数という
                // 
                // 例PSの値に応じてloo@関数が実行される時間間隔が変わる
                // FPSが60->1000/60=>16.666=>0.016秒後にloop関数を実行=.0.016秒ごとに１回手が切り替わる
                // FPSが10->1000/10=>100=>0.1秒後にloop関数を実行=.0.1秒ごとに１回手が切り替わる
                // FPSが1->1000/1=>1000=>1秒後にloop関数を実行=.01秒ごとに１回手が切り替わる
                setTimeout(loop, 1000 / FPS);
            }
            loop();
        };
        imgObj.src = IMAGE_PATH;
    }


    /**
     * グーチョキーパーの画像から特定の手の形を切り取る
     * @param{*}canvas HTMLのcanvas要素
     * @param{*}context canvasから取得した値。この値を使うことでcanvasに画僧や図形を描画することができる
     * @param{*}imageObject画像データ
     * @param{*}frame現在のフレーム数（コマ数)、フレーム%HAND_FOMRS.lengthによって0(グー),1(チョキ)2(パー)を決める
     * 
     */
    function draw(canvas, context, _imgObj, frame) {
        //canvasをまっさらな状態にする
        context.clearRect(0, 0, canvas.width, canvas.height);

        //0:グー 1:チョキ 2:パー
        const handIndex = frame % HAND_FORMS.length;
        const sx = HAND_X[handIndex];
        const swidth = HAND_WIDTH[handIndex];

        // 画像のx座標(sx)と指定した手の横幅(swidth)を使って、
        // グー・チョキ・パー画像('./img/sprite.png')から特定の手の形を切り取る
        context.drawImage(
           _imgObj,
            sx,
            0,
            swidth,
            _imgObj.height,
            0,
            0,
            swidth,
            canvas.height
        );
    }
    /**
      * ボタンクリック時の処理の定義をまとめて行う関数
      */
    function setButtonAction() {
        const rock = document.getElementById('rock');
        const scissors = document.getElementById('scissors');
        const paper = document.getElementById('paper');
        const restart = document.getElementById('restart');

        // グー・チョキ・パーのいずれかをクリックした時に呼ばれる。
        function onClick(event) {
            // 自分の手と相手の手の値を取得する。
            const myHandType = parseInt(event.target.value, 10);
            const enemyHandType = parseInt(currentFrame % HAND_FORMS.length, 10);

            // isPauseフラグをtrueにすることでloop関数内で呼び出している
            // draw関数が実行されなくなる。
            isPause = true;

            // 自分の手の値と相手の値をjudge関数に渡して勝敗を確認する。
            judge(myHandType, enemyHandType);
        }

        // グー・チョキ・パーボタンを押したときの処理をonClick関数で共通化
        rock.addEventListener('click', onClick);
        scissors.addEventListener('click',onClick);
        paper.addEventListener('click', onClick);

        // 再開ボタンを押したとき、ブラウザをリロードする
        // https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
        restart.addEventListener('click', function () {
            window.location.reload();
        });
    }

    // 自分の手の値(0~2のいずれか)と相手の手の値(0~2のいずれか)を使って計算を行い
    // 値に応じて勝ち・負け・引き分けを判断して、アラートに結果を表示する。
    function judge(myHandType, enemyHandType) {
        // 0: 引き分け, 1: 負け, 2: 勝ち
        // じゃんけんの勝敗判定のアルゴリズム: https://qiita.com/mpyw/items/3ffaac0f1b4a7713c869
        const result = (myHandType - Math.abs(enemyHandType) + 3) % HAND_FORMS.length;

        if (result === 0) {
            alert('引き分けです!');
        } else if (result === 1) {
            alert('あなたの負けです!');
        } else {
            alert('あなたの勝ちです!');
        }
    }

    // ボタンクリック時の処理の定義を行ってから、アニメーションを開始する
    setButtonAction();
    main()
})();
                
        

    


