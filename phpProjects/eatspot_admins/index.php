<?php
// header("Access-Control-Allow-Headers: Content-Type");
// header("Access-Control-Allow-Methods: GET, POST");
// header("Access-Control-Allow-Origin: *");

// echo json_encode($_POST);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    <script defer type="module">
        import {
            getFirestore,
            getDocs,
            collection,
        } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
        import {
            initializeApp
        } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDIxf_VgVaTT4LoqzcQ0QRHOq48-B7HEVA",
            authDomain: "projetoeatspot.firebaseapp.com",
            projectId: "projetoeatspot",
            storageBucket: "projetoeatspot.appspot.com",
            messagingSenderId: "618315571139",
            appId: "1:618315571139:web:c0d47f6238608b47a52776",
            measurementId: "G-JE1ZVL22K9"
        };

        const app = initializeApp(firebaseConfig);

        const firestore = getFirestore(app);

        async function getUserDocs() {
            const collectionUser = collection(firestore, "users");
            const docs = await getDocs(collectionUser);
            console.log(docs.docs[0].id);
            return docs;
        }

        $(document).ready(async function() {
            let docs = await getUserDocs();
            docs = docs.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            docs.forEach(doc => {
                const tableBody = document.querySelector("#tableBody");
                const tableRow = document.createElement("tr");

                const nameCol = document.createElement("th");
                nameCol.id = "name";
                nameCol.innerText = doc.name;

                const bornDateCol = document.createElement("th");
                bornDateCol.id = "bornDate";
                bornDateCol.innerText = doc.bornDate;

                const nacionalityCol = document.createElement("th");
                nacionalityCol.id = "nacionality";
                nacionalityCol.innerText = doc.nacionality;

                const numberOfRecipesCol = document.createElement("th");
                numberOfRecipesCol.id = "numberOfRecipes";
                numberOfRecipesCol.innerText = doc.numberOfRecipes;

                const createAccountDateCol = document.createElement("th");
                createAccountDateCol.id = "createAccountDate";
                createAccountDateCol.innerText = doc.createAccountDate;

                const buttonsCol = document.createElement("th");
                buttonsCol.style.display = "flex";
                buttonsCol.style.alignItems = "center"
                buttonsCol.style.justifyContent = "center"
                buttonsCol.style.gap = "20px"


                const buttonEdit = document.createElement("button");
                buttonEdit.type = "button";
                buttonEdit.className = "btn btn-outline-warning";

                const iconIonicEdit = document.createElement("ion-icon");
                iconIonicEdit.name = "pencil-outline";
                buttonEdit.appendChild(iconIonicEdit);

                const buttonDelete = document.createElement("button");
                buttonDelete.type = "button";
                buttonDelete.className = "btn btn-outline-danger";

                const iconIonicDelete = document.createElement("ion-icon");
                iconIonicDelete.name = "trash-outline";
                buttonDelete.appendChild(iconIonicDelete);

                buttonsCol.appendChild(buttonEdit);
                buttonsCol.appendChild(buttonDelete);

                tableRow.appendChild(nameCol);
                tableRow.appendChild(bornDateCol);
                tableRow.appendChild(nacionalityCol);
                tableRow.appendChild(numberOfRecipesCol);
                tableRow.appendChild(createAccountDateCol);
                tableRow.appendChild(buttonsCol);
                tableBody.appendChild(tableRow);
            })
        });
    </script>
    <title>Document</title>
</head>

<body>
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-secondary">
        <div class="container-fluid">
            <span class="navbar-brand text-danger">Eat<span class="text-warning">Spot</span></span>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active text-white" aria-current="page" href="./index.php">Usuários</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active text-white" aria-current="page" href="./receitas.php">Receitas</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div>

    </div>

    <main class="d-flex flex-column justify-content-center align-items-center mt-3">
        </div>
        <h1 class="mb-3">Tabela de usuários</h1>
        <table class="table table-dark table-striped-columns w-75">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Data de Nascimento</th>
                    <th>Nacionalidade</th>
                    <th>Nº de Receitas</th>
                    <th>Data de criação de conta</th>
                </tr>
            </thead>
            <tbody id="tableBody">
                <!-- <tr>
                    <th id="name">Alessandro</th>
                    <th>10-05-2006</th>
                    <th>Brazil</th>
                    <th>3</th>
                    <th>09-12-2003</th>
                    <th>
                        <button type="button" class="btn btn-outline-warning" onclick="teste()"><ion-icon name="pencil-outline"></ion-icon></button>
                        <button type="button" class="btn btn-outline-danger"><ion-icon name="trash-outline"></ion-icon></button>
                    </th>
                </tr> -->
            </tbody>
        </table>
    </main>






    <!-- <nav class="navbar bg-body-tertiary bg-secondary">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1 text-white">Navbar</span>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Dropdown
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav> -->
</body>

</html>