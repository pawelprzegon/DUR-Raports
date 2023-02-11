let appHeader = `

        <div class="top-row" id='anim-row'>
            <div class="top-elements">
                <div class="top-element">
                    <button type="button" class="nav-btn">
                        <span class="material-icons">
                            menu
                        </span>
                    </button>
                </div>
                <div class="top-element">
                    <img src="/static/images/artgeist.png" alt="artgeist" class='logo' id="logo">
                </div>
            </div>
            <div class="top-elements" >
                <nav class="nav nav-close" id="btns-pics">
                    <a href="raports.html" class="nav-link">Home</a>
                    <a href="statistics.html" class="nav-link">
                       Statystyki</a>
                    <a href="users.html" class="nav-link">
                       Moje</a>
                    <a href="create.html" class="nav-link">
                        Dodaj</a>
                    <a href="#" class="nav-link">
                        Edytuj</a>
                    <a href="#" class="nav-link">
                        Usuń</a>
                    <a href="#" class="nav-link">
                        Wyloguj</a>
                </nav>  
            </div>   
        </div> 

        <div class="nav-overlay"></div>

        
`;
document.getElementById("app-header").innerHTML = appHeader;

