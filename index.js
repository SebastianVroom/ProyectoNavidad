class Entrada{
    constructor(img, title,tema,generos,link){
        this.cover = img.replace(/cover\..+\.jpg$/,'cover.small.jpg')
        this.title = title
        this.temas = tema
        this.generos = generos
        this.readLink = link
    }
}

class InterfazEnt{
    constructor(padr,img,title,tema,generos,link){
        this.data = new Entrada(img,title,tema,generos,link)
        this.element = document.createElement('article')

        this.container = padr
        this.container.appendChild(this.element)

        this.cover = document.createElement('img')
        this.cover.src = this.data.cover
        this.element.appendChild(this.cover)

        this.titulo = document.createElement('h4')
        this.titulo.innerHTML = this.data.title
        this.element.appendChild(this.titulo)

        this.temas = document.createElement('ul')
        let tem = '<p>Subjects:</p>'
        for (let t of this.data.temas){
            tem += `<li>${t}</li>`
        }
        this.temas.innerHTML = tem
        this.temas.style.display='none'
        this.element.appendChild(this.temas)

        this.generos = document.createElement('ul')
        let gen = '<p>Genre:</p>'
        for (let g of this.data.generos){
            gen += `<li>${g}</li>`
        }
        this.generos.innerHTML = gen
        this.generos.style.display='none'
        this.element.appendChild(this.generos)

        this.enlace = document.createElement('a')
        this.enlace.innerHTML = 'Read online'
        this.enlace.href = this.data.readLink
        this.enlace.style.display = 'none'
        this.enlace.target = '_blank'
        this.element.appendChild(this.enlace)

        this.element.addEventListener('click',()=>this.expandir())
        this.element.addEventListener('mouseleave',()=>this.retraer())
    }

    expandir(){
        this.temas.style.display='block'
        this.enlace.style.display = 'block'
        this.generos.style.display='block'
        this.element.style.width = '100%'
        this.element.style.height = `${Math.max(this.temas.offsetHeight,this.generos.offsetHeight,250)}px`
    }

    retraer(){
        this.temas.style.display='none'
        this.enlace.style.display = 'none'
        this.generos.style.display='none'
        this.element.style.width = '350px'
        this.element.style.height = '250px'
    }
}

class Galeria{
    constructor(cont){
        this.entradas = []
        this.contenedor = cont
    }
    addEnt(img,titu,tema,generos,link){
        this.entradas.push(new InterfazEnt(this.contenedor,img,titu,tema,generos,link))
    }
}

var gal = new Galeria(document.getElementById('main'))

var requestURL = "https://gutendex.com/books"

var fetching = false

function requestBooks(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let resp = JSON.parse(this.responseText)
            requestURL = resp['next']
            for(let lib of resp['results']){
                gal.addEnt(lib['formats']['image/jpeg'],lib['title'],lib['subjects'],lib['bookshelves'],lib['formats']['text/html'])
            }
            fetching = false
        }else if(this.readyState == 4){
            fetching = false
        }
    };
    xhttp.open("GET", requestURL, true);
    xhttp.send();
    fetching = true
}

function getBackground(){
    let r = randInt(0,256)
    let g = randInt(0,256)
    let b = randInt(0,256)
    document.body.style.backgroundImage = `url('https://php-noise.com/noise.php?r=${r}&g=${g}&b=${b}')`
}

function randInt(a,b){
    return Math.floor((Math.random * (b - a)) + a)
}

window.addEventListener('load',()=>{
    requestBooks()
    getBackground()
})

window.addEventListener('scroll',()=>{
    if ((2.5 * window.innerHeight + window.scrollY > document.body.clientHeight) && !fetching){
        requestBooks()
    }
})