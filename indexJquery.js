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
        this.element = $('<article>')

        this.container = $(padr)
        this.container.append(this.element)

        this.cover = $('<img>').attr('src',this.data.cover)
        this.element.append(this.cover)

        this.titulo = $(`<h4>${this.data.title}</h4>`)
        this.element.append(this.titulo)

        this.temas = $('<ul>').html('<p>Subjects:</p>').css('display','none')
        for (let t of this.data.temas){
            this.temas.append($(`<li>${t}</li>`)) 
        }
        this.element.append(this.temas)

        this.generos = $('<ul>').html('<p>Genre:</p>').css('display','none')
        for (let g of this.data.generos){
            this.generos.append($(`<li>${g}</li>`)) 
        }
        this.element.append(this.generos)

        this.enlace = $('<a>Read online</a>').attr({href:this.data.readLink,target:'_blank'}).css('display','none')
        this.element.append(this.enlace)

        this.element.click(()=>this.expandir()).mouseleave(()=>this.retraer())

        this.card = this.temas.add(this.generos).add(this.enlace)
    }

    expandir(){
        this.card.fadeIn()
        $(this.element).css('width','100%','height',`${Math.max(this.temas.offsetHeight,this.generos.offsetHeight,250)}px`)
    }

    retraer(){
        this.card.hide()
        $(this.element).css('width','350px','height','250px')
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
    fetching = true
    $('#loadinganim').show()
    $.ajax(
        {url:requestURL,
        type:'GET',
        dataType:'json'})
    .done(function(json) {
        requestURL = json['next']
        for(let lib of json['results']){
            gal.addEnt(lib['formats']['image/jpeg'],lib['title'],lib['subjects'],lib['bookshelves'],lib['formats']['text/html'])
        }       
    })
    .always(function () {
        $('#loadinganim').hide()
        fetching = false
    })
}

function getBackground(){
    let r = randInt(0,256)
    let g = randInt(0,256)
    let b = randInt(0,256)
    $.get(`https://php-noise.com/noise.php?r=${r}&g=${g}&b=${b}&json`,function(resp){
        $('body').css('background-image','url('+resp['uri']+')')
    })
}

function randInt(a,b){
    return Math.floor((Math.random() * (b - a)) + a)
}

$(document).ready(function(){
    requestBooks()
    getBackground()
})

$(document).scroll(function(){
    if ((2.5 * window.innerHeight + window.scrollY > document.body.clientHeight) && !fetching){
        requestBooks()
    }
})