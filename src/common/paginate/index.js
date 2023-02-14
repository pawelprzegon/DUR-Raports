export function addPaginate(){

    /* create elements */
    const elem = document.querySelector('#raport');
    const paginateBox = document.createElement('div')
    paginateBox.classList.add('paginateBox')
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




    let paginationLimit = 0;

    if ( $(window).width() <= 600) {     
        paginationLimit = 2;
        }
        else if (( $(window).width() > 600) && ( $(window).width() <= 900)){
            paginationLimit = 6;
        }else{
            paginationLimit = 12;
        }

    const paginationNumbers = document.getElementById("pagination-numbers");
    const paginatedList = document.getElementById("raport");
    const listItems = paginatedList.querySelectorAll("li");
    const nextButton = document.getElementById("next-button");
    const prevButton = document.getElementById("prev-button");

    
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

    

    const AddPaginate = () => {
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
        };

    AddPaginate();
    

}