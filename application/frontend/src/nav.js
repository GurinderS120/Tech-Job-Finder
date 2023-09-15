const createNav = () => {
    let nav = document.querySelector('.navbar');

    nav.innerHTML = `
    <header>

    <p>Team 02</p>
    <ul class = "nav_links">
        <li><a href="/public/home.html">Home</a></li>
        <li><a href="#">Service1</a></li>
        <li><a href="#">Service2</a></li>
        <li><a href="#">Service3</a></li>
        <li><a href="#">About Us</a>
            <ul>
                <li><a href="/public/zubin.html">Zubin Kanga</a></li>
                <li><a href="/public/brandon.html">Brandon Butler</a></li>
                <li><a href="/public/anudeep.html">Anudeep Katukojwala</a></li>
                <li><a href="/public/sebastian.html">Wcislo Sebastian</a></li>
                <li><a href="/public/cat.html">Cat Tuong Vu</a></li>
                <li><a href="/public/guirinder.html">Gurinder Singh</a></li>
            </ul>  
        </li>           
    </ul>

</header>`;
}

createNav();