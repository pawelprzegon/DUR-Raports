$("body").css("overflow", "hidden");
// api url
const api_url = 
      "https://mocki.io/v1/1f2aff46-ef0b-4c2c-9863-1dc3c02a1665";

// import api_url from '../data.json' assert {type: "json"};

  
// Defining async function
async function getapi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();

    
    if (response) {
        hideloader();
    }
        console.log(data);
        show(data);
        addPaginate();

}
// Calling that async function
getapi(api_url);
  
// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

// Function to define innerHTML for HTML table
function show(data) {
    
    const raportList = document.querySelector('#raport');
    raportList.innerHTML = '';

    data.items.forEach(each => {
        const raportInfoGrid = document.createElement('li')

            const raportDataUser = document.createElement('div');
                const detailsDate = document.createElement('p');
                const detailsUser = document.createElement('p');
                const btnL = document.createElement('a')
                const moreButton = document.createElement('button');

            const raportRegions = document.createElement('div');
                const StolarniaBox = document.createElement('div');
                    const raportRegionsStolarnia = document.createElement('div');
                    const raportCircleStolarnia = document.createElement('p');
                const DrukarniaBox = document.createElement('div');
                    const raportRegionsDrukarnia = document.createElement('div');
                    const raportCircleDrukarnia = document.createElement('p');
                const BibelotyBox = document.createElement('div');
                    const raportRegionsBibeloty = document.createElement('div');
                    const raportCircleBibeloty = document.createElement('p');

        raportInfoGrid.classList.add('raport-info-grid')

            raportInfoGrid.addEventListener("mouseover", (e) => {
                if (e.target.firstChild.hasChildNodes())
                    if((e.target.firstChild.childNodes.length)>2){
                        e.target.firstChild.children[0].classList.add('bold')
                        e.target.firstChild.children[1].classList.add('bold')
                        if (e.target.firstChild.children[2].hasChildNodes())
                            // console.log(e.target.firstChild.children[2].children[0])
                            e.target.firstChild.children[2].children[0].classList.add('hover-btn')
                            // e.target.style.backgroundColor = 'pink'
                    }
            });
            raportInfoGrid.addEventListener("mouseleave", (e) => {
                if (e.target.firstChild.hasChildNodes())
                    if((e.target.firstChild.childNodes.length)>2){
                        e.target.firstChild.children[0].classList.remove('bold')
                        e.target.firstChild.children[1].classList.remove('bold')
                        if (e.target.firstChild.children[2].hasChildNodes())
                            // console.log(e.target.firstChild.children[2].children[0])
                            e.target.firstChild.children[2].children[0].classList.remove('hover-btn')
                            // e.target.style.backgroundColor = 'var(--bridge)'
                    }
            });
        raportDataUser.classList.add('raport-data-user')
        detailsDate.classList.add('raport-details')
        detailsDate.classList.add('raport-details')
        detailsUser.classList.add('raport-details')

        moreButton.classList.add('raport-btn')

        raportRegions.classList.add('raport-regions')
        StolarniaBox.classList.add('regio-circle-box')
        DrukarniaBox.classList.add('regio-circle-box')
        BibelotyBox.classList.add('regio-circle-box')
        raportRegionsStolarnia.classList.add('regions-headers')
        raportCircleStolarnia.classList.add('raport-circle-empty')
        raportRegionsDrukarnia.classList.add('regions-headers')
        raportCircleDrukarnia.classList.add('raport-circle-empty')
        raportRegionsBibeloty.classList.add('regions-headers')
        raportCircleBibeloty.classList.add('raport-circle-empty')


        
        detailsDate.innerText = `${each.date_created}`;
        detailsUser.innerText = `${each.author.username.capitalize()}`;
        moreButton.innerText = 'WIĘCEJ';
        btnL.setAttribute("href","raport.html");

        let stolarnia = 0;
        let drukarnia = 0;
        let bibeloty = 0;

        each.units.forEach(each => {
            if(each.region == 'stolarnia'){
                stolarnia +=1;
            }else if(each.region == 'drukarnia'){
                drukarnia +=1;
            }else{
                bibeloty+=1;
            }
        })

        raportRegionsStolarnia.innerText = 'Stolarnia';
        raportCircleStolarnia.innerText = stolarnia;
        raportRegionsDrukarnia.innerText = 'Drukarnia';
        raportCircleDrukarnia.innerText = drukarnia;
        raportRegionsBibeloty.innerText = 'Bibeloty';
        raportCircleBibeloty.innerText = bibeloty;
    
        if (stolarnia > 0){
            raportCircleStolarnia.classList.add('full')
        }
        if (drukarnia > 0){
            raportCircleDrukarnia.classList.add('full')
        }
        if (bibeloty > 0){
            raportCircleBibeloty.classList.add('full')
        }

        
        raportInfoGrid.appendChild(raportDataUser)
        raportDataUser.appendChild(detailsDate)
        raportDataUser.appendChild(detailsUser)
        btnL.appendChild(moreButton)
        raportDataUser.appendChild(btnL)
        raportInfoGrid.appendChild(raportRegions)

        raportRegions.appendChild(StolarniaBox)
            StolarniaBox.appendChild(raportRegionsStolarnia)
            StolarniaBox.appendChild(raportCircleStolarnia)

        raportRegions.appendChild(DrukarniaBox)
            DrukarniaBox.appendChild(raportRegionsDrukarnia)
            DrukarniaBox.appendChild(raportCircleDrukarnia)

        raportRegions.appendChild(BibelotyBox)
            BibelotyBox.appendChild(raportRegionsBibeloty)
            BibelotyBox.appendChild(raportCircleBibeloty)

        raportList.appendChild(raportInfoGrid)

        
});
// dodawanie paginate
const elem = document.querySelector('#raport');
const paginateBox = document.createElement('div')
const paginate = document.createElement('nav')
const prevBtn = document.createElement('button')
    prevBtn.classList.add("pagination-button")
    prevBtn.id = 'prev-button'
    prevBtn.ariaLabel = "Previous page"
    prevBtn.title = "Previous page"
    prevBtn.innerHTML = '&lt;'
    const numb = document.createElement('div')
    numb.id = "pagination-numbers"
    const nextBtn = document.createElement('button')
    nextBtn.classList.add("pagination-button")
    nextBtn.id = 'next-button'
    nextBtn.ariaLabel = "Next page"
    nextBtn.title = "Next page"
    nextBtn.innerHTML = "&gt;"


paginate.classList.add('pagination-container')
paginate.appendChild(prevBtn)
paginate.appendChild(numb)
paginate.appendChild(nextBtn)

paginateBox.appendChild(paginate)
elem.appendChild(paginateBox)

}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });



  
  function addPaginate(){
    

    const paginationNumbers = document.getElementById("pagination-numbers");
    const paginatedList = document.getElementById("raport");
    const listItems = paginatedList.querySelectorAll("li");
    const nextButton = document.getElementById("next-button");
    const prevButton = document.getElementById("prev-button");

    const paginationLimit = 2;
    const pageCount = Math.ceil(listItems.length / paginationLimit);
    let currentPage = 1;

    const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
    };

    const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
    };

    const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
        disableButton(prevButton);
    } else {
        enableButton(prevButton);
    }

    if (pageCount === currentPage) {
        disableButton(nextButton);
    } else {
        enableButton(nextButton);
    }
    };

    const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
        button.classList.remove("active");
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage) {
        button.classList.add("active");
        }
    });
    };

    const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);

    paginationNumbers.appendChild(pageNumber);
    };

    const getPaginationNumbers = () => {
    for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i);
    }
    };

    const setCurrentPage = (pageNum) => {
    currentPage = pageNum;

    handleActivePageNumber();
    handlePageButtonsStatus();
    
    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;

    listItems.forEach((item, index) => {
        item.classList.add("hidden");
        if (index >= prevRange && index < currRange) {
        item.classList.remove("hidden");
        }
    });
    };

    window.addEventListener("load", () => {
    getPaginationNumbers();
    setCurrentPage(1);

    prevButton.addEventListener("click", () => {
        setCurrentPage(currentPage - 1);
    });

    nextButton.addEventListener("click", () => {
        setCurrentPage(currentPage + 1);
    });

    document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));

        if (pageIndex) {
        button.addEventListener("click", () => {
            setCurrentPage(pageIndex);
        });
        }
    });
    });


}