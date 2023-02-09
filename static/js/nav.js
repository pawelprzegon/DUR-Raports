let appHeader = `
        <div class="top-row">
        <button type="button" class="nav-btn">
            <span class="material-icons">
                menu
            </span>
        </button>
        <img src="/static/images/artgeist.png" alt="artgeist">
        </div>
        <div class="nav-overlay"></div>
        <nav class="nav">
        <a href="raports.html" class="nav-link">
            <div class="nav-image"><img src="../static/images/nav_icons/task-edit-icon.png" alt="Home" height="30"></div>Home</a>
        <a href="statistics.html" class="nav-link">
            <div class="nav-image"><img src="../static/images/nav_icons/graph-icon.png" alt="Statistics" height="30"></div>Statystyki</a>
        <a href="users.html" class="nav-link">
            <div class="nav-image"><img src="../static/images/nav_icons/task-user-icon.png" alt="My" height="30"></div>Moje</a>
        <a href="create.html" class="nav-link">
            <div class="nav-image"><img src="../static/images/nav_icons/add-icon.png" alt="Add" height="30"></div>Dodaj</a>
        <a href="#" class="nav-link">
            <div class="nav-image"><img src="../static/images/nav_icons/task-edit-icon.png" alt="Edit" height="30"></div>Edytuj</a>
        <a href="#" class="nav-link">
            <div class="nav-image"><img src="../static/images/nav_icons/task-minus-icon.png" alt="Delete" height="30"></div>Usuń</a>
        <a href="#" class="nav-link">
            <div class="nav-image"><img src="../static/images/nav_icons/logout-line-icon.png" alt="Logout" height="30"></div>Wyloguj</a>
        </nav> 
`;
document.getElementById("app-header").innerHTML = appHeader;

