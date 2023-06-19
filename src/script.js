import Image1 from './assets/Image1.png'
import Image2 from './assets/Image2.png'
import Image3 from './assets/Image3.png'
import Cursor from './assets/Cursor.svg'

const CONFIG = {
  pagesCount: 4,
  answerVariants: [
    { text: 'Хомяк-терминатор', image: Image1 },
    { text: 'Человек-штрих', image: Image2 },
    { text: 'Чудо-юдо', image: Image3 },
  ],
  animationDuration: 500,
  loadingDuration: 2000,
  linkToStore: 'https://play.google.com/store/apps/details?id=com.yandex.shedevrus'
}

class PageManager {
  static instance = null
  nodes = {
    pages: {},
    answerVariants: {},
    cursor: null
  }
  currentPage = 1

  #intervalAnimation = null
  quizChooser = null

  constructor(quizChooser) {
    if (PageManager.instance) {
      return PageManager.instance
    }

    this.#parsePage()
    this.quizChooser = quizChooser

    PageManager.instance = this
  }

  goToNextPage() {
    this.#hideNode(this.nodes.pages[`page${this.currentPage}`])
    this.currentPage++
    this.#showNode(this.nodes.pages[`page${this.currentPage}`])
    this.#initPageEvents()
  }

  USPAction() {
    console.log('USPAction')
    window.mraid && window.mraid.open(CONFIG.linkToStore)
  }

  #parsePage() {
    this.#initPages()
    this.#initAnswerVariants()
    this.#initCursorOnFirstPage()
  }

  #initPages() {
    for (let i = 1; i < CONFIG.pagesCount + 1; i++) {
      this.nodes.pages[`page${i}`] = document.getElementById(`page${i}`)
    }

    document.getElementById('DownloadButton').addEventListener('click', () => this.USPAction())
  }

  #initAnswerVariants() {
    for (let i = 0; i < CONFIG.answerVariants.length; i++) {
      const answerVariant = CONFIG.answerVariants[i]
      this.nodes.answerVariants[`answerVariant${i}`] = document.createElement('div')
      this.nodes.answerVariants[`answerVariant${i}`].classList.add('Answer', 'button')
      this.nodes.answerVariants[`answerVariant${i}`].innerText = answerVariant.text
      this.nodes.answerVariants[`answerVariant${i}`].addEventListener('click', () => {
        this.quizChooser.onAnswerClick(answerVariant)
        clearInterval(this.#intervalAnimation)
      })

      this.nodes.pages['page1']
        .getElementsByClassName('AnswerVariants')[0]
        .appendChild(this.nodes.answerVariants[`answerVariant${i}`])
    }
  }

  #initCursorOnFirstPage() {
    let counter = 0
    this.nodes.cursor = document.getElementById('Cursor')
    this.nodes.cursor.style.top = this.#getAbsolutePositon(this.nodes.answerVariants[`answerVariant${counter}`]).top -60 +'px'
    this.nodes.cursor.style.left = this.#getAbsolutePositon(this.nodes.answerVariants[`answerVariant${counter}`]).left - 60 +'px'

    this.#intervalAnimation = setInterval(() => {
        this.nodes.cursor.style.top = this.#getAbsolutePositon(this.nodes.answerVariants[`answerVariant${counter}`]).top -60 +'px'
        this.nodes.cursor.style.left = this.#getAbsolutePositon(this.nodes.answerVariants[`answerVariant${counter}`]).left - 60 +'px'
        if (counter < CONFIG.answerVariants.length -1) {
            counter++
        } else {
            counter = 0
        }
    }, 1000)

    
  }

  #getAbsolutePositon(node) {
    const rect = node.getBoundingClientRect();
    return {
      left: (rect.left + rect.width / 2),
      top: rect.bottom 
    }
  }

  #hideNode(node) {
    node.style.opacity = 0
    setTimeout(() => {
      node.style.display = 'none'
    }, CONFIG.animationDuration)
  }

  #showNode(node, displayStyle = 'flex') {
    node.style.opacity = 0
    node.style.display = displayStyle
    setTimeout(() => {
      node.style.opacity = 1
    }, CONFIG.animationDuration)
  }

  #initPageEvents() {
    switch (this.currentPage) {
      case 1:
        break
      case 2:
        document.getElementById('GeneratedImageText').innerText =
          this.quizChooser.choosenAnswerVariant.text
        document.getElementById('GeneratedImage').src = this.quizChooser.choosenAnswerVariant.image
        setTimeout(() => {
          this.goToNextPage()
        }, CONFIG.loadingDuration)
        break
      case 3:
        document.getElementById('TryAgainButton').addEventListener('click', () => this.goToNextPage())
        break
      case 4:
        let page4 = document.getElementById('page4')
        page4.addEventListener('click', () => this.USPAction())
        this.nodes.cursor.parentNode.removeChild(this.nodes.cursor)
        page4.appendChild(this.nodes.cursor)
        this.nodes.cursor.style.top = 20 + '%'
        this.nodes.cursor.style.left = 50 + '%'
        break
      default:
        break
    }
  }

  
}

class QuizChooser {
  static instance = null
  pageManager = null
  choosenAnswerVariant = null

  constructor() {
    if (QuizChooser.instance) {
      return QuizChooser.instance
    }

    QuizChooser.instance = this
  }

  onAnswerClick(answerVariant) {
    this.choosenAnswerVariant = answerVariant
    this.pageManager.goToNextPage()

    console.log(this.choosenAnswerVariant)
  }
}

class Main {
  run() {
    const pageManager = new PageManager(new QuizChooser())
    const quizChooser = new QuizChooser()
    quizChooser.pageManager = pageManager

    console.log(pageManager)
    console.log(quizChooser)
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Main().run()
})
