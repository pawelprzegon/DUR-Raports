
export function navBar(user){
    const header = document.getElementById("app-header")

    document.getElementById('nav-theme').setAttribute('href', "/src/common/navigation/navigation.css");

    const topRow = document.createElement('div');
    topRow.classList.add('top-row')
    topRow.id = 'anim-row'
        const topElements = document.createElement('div');
        topElements.classList.add('top-elements')
            const topElement = document.createElement('div');
            topElement.classList.add('top-element')
                const empty = document.createElement('div')
                empty.classList.add('top-element')
                empty.id = 'empty'
                const navBtn = document.createElement('button');
                navBtn.classList.add('nav-btn')
                    const link = document.createElement('span');
                    link.classList.add('material-icon')
                    link.innerText = 'menu'


            const UserBox = document.createElement('div')
            UserBox.classList.add('top-element')
                const preUserLabel = document.createElement('span');
                preUserLabel.classList.add('pre-nav-user')
                preUserLabel.innerText = 'Logged: '
                const userLabel = document.createElement('span');
                userLabel.classList.add('nav-user')
                userLabel.id = 'nav-user'
                userLabel.innerText = user.capitalize();
            const LogoBox = document.createElement('div')
            LogoBox.classList.add('top-element')
                const logo = document.createElement('img')
                logo.src = '/src/static/artgeist.png'
                logo.alt = 'artgeist'
                logo.id = 'logo'
                logo.classList.add('logo')

        navBtn.appendChild(link)
        topElement.appendChild(navBtn)
        UserBox.appendChild(preUserLabel)
        UserBox.appendChild(userLabel)
        LogoBox.appendChild(logo)
        
        topElements.appendChild(topElement)
        topElements.appendChild(empty)


        const btnsPics = document.createElement('nav');
        btnsPics.classList.add('nav', 'nav-close')
        btnsPics.id = 'btns-pics'

        const home = document.createElement('a');
        home.classList.add('nav-link')
        home.href = '/'
        home.innerText = 'home'
        home.setAttribute('data-link', '')


        const stat = document.createElement('a')
        stat.classList.add('nav-link')
        stat.href = '/statistics'
        stat.innerText = 'statystyki'
        stat.setAttribute('data-link', '')
   
        const moje = document.createElement('a')
        moje.classList.add('nav-link')
        moje.href = '/my/'+user
        moje.innerText = 'moje'
        moje.setAttribute('data-link', '')

        const dodaj = document.createElement('a')
        dodaj.classList.add('nav-link')
        dodaj.href = '/create'
        dodaj.innerText = 'dodaj'
        dodaj.setAttribute('data-link', '')
 
        // const edytuj = document.createElement('a')
        // edytuj.classList.add('nav-link')
        // edytuj.href = '/edit'
        // edytuj.innerText = 'edytuj'
        // edytuj.setAttribute('data-link', '')
        // edytuj.id = 'edytuj'
        // edytuj.classList.add('nav-btn-hidden')

        // const usun = document.createElement('a')
        // usun.classList.add('nav-link')
        // usun.href = '/delete'
        // usun.setAttribute('data-link', '')
        // usun.innerText = 'usun'
        // usun.id = 'usun'
        // usun.classList.add('nav-btn-hidden')

        const wyloguj = document.createElement('a')
        wyloguj.classList.add('nav-link')
        wyloguj.href = '/logout'
        wyloguj.setAttribute('data-link', '')
        wyloguj.innerText = 'wyloguj'

        btnsPics.appendChild(home)
        btnsPics.appendChild(stat)
        btnsPics.appendChild(moje)
        btnsPics.appendChild(dodaj)
        // btnsPics.appendChild(edytuj)
        // btnsPics.appendChild(usun)
        btnsPics.appendChild(wyloguj)
        topElements.appendChild(btnsPics)
        topElements.appendChild(UserBox)
        topElements.appendChild(LogoBox)
    
    topRow.appendChild(topElements)
    // topRow.appendChild(topElementsBtns)

    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay')

    header.appendChild(topRow)
    header.appendChild(overlay)
}

export function navBehav(){

    const navOverlay = document.querySelector(".nav-overlay");
    const navButton = document.querySelector(".nav-btn");
    const btns = document.querySelector("nav");
    const pic = document.getElementById("logo")
    const elem = document.getElementById("anim-row")
    const navSecondRow = document.getElementById("btns-pics")
    navButton.addEventListener("click", e =>{
        elem.classList.add("big-row")
        pic.classList.add('big')
        btns.classList.remove("nav-close")
        navSecondRow.classList.add("nav-btns", "show-anim-nav")
        navOverlay.classList.add("nav-overlay-open");
        document.getElementById('empty').classList.add('nav-close')
    });
    
    
    navOverlay.addEventListener("click", () =>{
        navSecondRow.classList.remove("show-anim-nav")
        elem.classList.remove("big-row")
        pic.classList.remove('big')
        btns.classList.add("nav-close")
        navOverlay.classList.remove("nav-overlay-open");
        document.getElementById('empty').classList.remove('nav-close')

    })
    
    }


export function navClose(){

    const navOverlay = document.querySelector(".nav-overlay");
    const btns = document.querySelector("nav");
    const pic = document.getElementById("logo")
    const elem = document.getElementById("anim-row")

    elem.classList.remove("big-row", "show-anim-nav")
    pic.classList.remove('big')
    btns.classList.add("nav-close")
    navOverlay.classList.remove("nav-overlay-open");
}

// export function navUserBehav(raportUser, id){
//     if (raportUser === getCookieValue('user')){
//         let usun = document.getElementById('usun')
//         usun.href = '/delete/'+id
//         usun.classList.remove('nav-btn-hidden')
//         let edytuj = document.getElementById('edytuj')
//         edytuj.href = '/edit/'+id
//         edytuj.classList.remove('nav-btn-hidden')
//     }else{
//         document.getElementById('edytuj').classList.add('nav-btn-hidden')
//         document.getElementById('edytuj').href = '#'
//         document.getElementById('usun').classList.add('nav-btn-hidden')
//         document.getElementById('usun').href = '#'
//     }
// }

// export function navCloseBtns(){
//     let edit = document.getElementById('edytuj')
//     edit.classList.add('nav-btn-hidden')
//     document.getElementById('edytuj').href = '#'
//     let del = document.getElementById('usun')
//     del.classList.add('nav-btn-hidden')
//     document.getElementById('usun').href = '#'
// }

