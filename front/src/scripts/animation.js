import './animation.css'

export default function playAnimation() {
    let content = document.getElementById('content')
    //let placeholder = document.getElementById('placeholder')
    let picture = document.getElementById('picture')
    
    //hide picture, slide content up
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        picture.classList.add('hidden')
        //placeholder.classList.remove('hidden')
        content.classList.remove('animation-down')
        content.classList.add('animation-up')
    } else {
        picture.classList.remove('hidden')
        //placeholder.classList.add('hidden')
        content.classList.remove('animation-up')
        content.classList.add('animation-down')
    }
}