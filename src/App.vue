<template lang="pug">
  .container
    .page-header
      h1 かけ<ruby>算<rp>(</rp><rt>ざん</rt><rp>)</rp></ruby>おぼえるぞ！
    
    template(v-if="started")
      .mondai {{a}} × {{b}} = {{kaitou}}
      .kekka {{kekkaMsg}}
      .kaitou
        template(v-for="k in kaitouKouho")
          button.kaitoKouho(@click="clickKaitou(k)") {{k}}
    template(v-else)
      .init
        template(v-for="n in [2, 3, 4, 5, 6, 7, 8, 9]")
          input(type="checkbox" v-model="dan" :value="n" :id="'dan-' + n")
          label(:for="'dan-' + n") {{n}}のだん
          br
        br
        button.start(@click="start()") スタート！
    template(v-if="owari")
      .owari
        div <ruby>点数<rp>(</rp><rt>てんすう</rt><rp>)</rp></ruby>: {{ getTensu() }} <ruby>点<rp>(</rp><rt>てん</rt><rp>)</rp></ruby>
        button(@click="mouichido()") もういちど

    audio#sound-correct(preload="auto")
      source(src="correct071.mp3" type="audio/mp3")
    audio#sound-buzzer(preload="auto")
      source(src="Quiz-Wrong_Buzzer01-1.mp3" type="audio/mp3")
</template>

<script>

export default {
  data () {
    return {
      started: false,
      dan: [ 3 ],
      mondai: [],
      index: 0,
      a: 0,
      b: 0,
      kaitou: "",
      kaitouKouho: [ 1, 2, 3, 4, 5 ],
      kekkaMsg: "",
      seikai: false,
      machigai: 0,
      owari: false,
      soundCorrect: null,
      soundBuzzer: null
    }
  },
  mounted () {
    this.soundCorrect = window.document.getElementById("sound-correct")
    this.soundBuzzer = window.document.getElementById("sound-buzzer")
  },
  methods: {
    start () {
      // 問題作成
      this.mondai = []
      this.index = 0
      this.machigai = 0
      for (let i = 0; i < this.dan.length; i++) {
        for (let j = 2; j <= 9; j++) {
          this.mondai.push([this.dan[i], j])
        }
      }
      this.mondai = this.shuffle(this.mondai)

      this.shutsudai()
      this.started = true
    },
    shutsudai () {
      this.a = this.mondai[this.index][0]
      this.b = this.mondai[this.index][1]
      let k0 = (this.a * this.b) - Math.floor(Math.random() * 5)
      this.kaitouKouho = [ k0, k0 + 1, k0 + 2, k0 + 3, k0 + 4 ]

      this.kekkaMsg = ""
      this.seikai = false
      this.kaitou = ""
    },
    clickKaitou (k) {
      if (this.seikai) {// 二重回答防止
        return
      }
      this.kaitou = k

      this.soundBuzzer.pause()
      this.soundBuzzer.currentTime = 0
      this.soundCorrect.pause()
      this.soundCorrect.currentTime = 0

      if (this.kaitou === this.a * this.b) {
        this.soundCorrect.play()
        this.kekkaMsg = "せいかい！"
        this.seikai = true
        setTimeout(() => {
          this.index++
          if (this.index === this.mondai.length) {
            this.kekkaMsg = "おわり"
            this.owari = true
          } else {
            this.shutsudai()
          }
        }, 1000)
      } else {
        this.soundBuzzer.play()
        this.kekkaMsg = "ちがうよ"
        this.machigai++
      }
    },
    getTensu () {
      return Math.floor(((this.mondai.length - this.machigai) / this.mondai.length) * 100)
    },
    mouichido () {
      this.started = false
      this.owari = false
    },
    shuffle (array) {
      for (let i = array.length; 1 < i; i--) {
        let k = Math.floor(Math.random() * i);
        [array[k], array[i - 1]] = [array[i - 1], array[k]];
      }
      return array;
    }
  }
}
</script>

<style lang="sass">

.page-header
  font-family: 'UD デジタル 教科書体 N-B', 'ヒラギノ丸ゴ ProN'
  background-color: #a260bf
  color: white
  padding: 20px
  text-align: center
  h1
    font-size: 2rem

.init
  margin-top: 20px
  font-size: 20px
  text-align: center
  select
    height: 250px

.mondai
  margin-top: 20px
  font-size: 50px
  text-align: center

button.kaitoKouho
  margin-right: 10px

.kekka
  font-size: 30px
  text-align: center
  height: 60px

.kaitou
  text-align: center
  button
    font-size: 30px
    &:focus
      outline: none
.owari
  text-align: center
  font-size: 45px
  button
    font-size: 30px

</style>
