import Pusher from 'pusher-js';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

window.addEventListener("load", () => {
    var app = {
        pizzas: document.querySelector("#pizzas"),
        latestVotes: document.querySelector("#latestVotes"),
        data: [
            {
                "id": "65ca9f2e-23bb-4e7e-9ef2-adb92a3b8021",
                "name": "Spinach & Feta",
                "category": "Specialty Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "c871d296-c6a3-4879-8de1-d5b63e6db356",
                "name": "Wisconsin 6 Cheese",
                "category": "Specialty Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "fbd2523e-8853-4a4d-864b-19f98d981e52",
                "name": "Honolulu Hawaiian",
                "category": "Specialty Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "5a89a04a-83ec-491a-881c-d90e374eee6d",
                "name": "Philly Cheese Steak",
                "category": "Specialty Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "a641e3be-a028-47cc-9c3f-847ef89d6fac",
                "name": "Pacific Veggie",
                "category": "Specialty Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "48e336e4-ba09-4a99-91bf-d467fb08bdf1",
                "name": "Cali Chicken Bacon Ranch\u2122",
                "category": "Specialty Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "080673ce-3a8d-490d-98ce-8946a054446c",
                "name": "Fiery Hawaiian\u2122",
                "category": "Specialty Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "d1edaf57-f0e3-4314-8090-74b16d60c2fc",
                "name": "Buffalo Chicken",
                "category": "Specialty Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "e18d72f2-5ddf-4893-87de-93932404f2b4",
                "name": "Memphis BBQ Chicken",
                "category": "Specialty Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "4b3c08d0-a332-4de5-9186-b8dac92196f8",
                "name": "America's Favorite Feast\u00ae",
                "category": "Feast Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "8e9140b9-7499-4c4d-8a3a-e23be4e10915",
                "name": "Bacon Cheeseburger Feast\u00ae",
                "category": "Feast Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "e6c55418-010c-46b0-b253-b24cd19fc494",
                "name": "Deluxe Feast\u00ae",
                "category": "Feast Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "622b63f8-75f0-4c7f-848b-3a8858d42561",
                "name": "ExtravaganZZa Feast\u00ae",
                "category": "Feast Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "eb04dd74-98fd-4838-9437-7155bb6eb2ed",
                "name": "MeatZZa Feast\u00ae",
                "category": "Feast Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "cc54f77f-0002-4c14-839a-3f18785330e2",
                "name": "Ultimate Pepperoni Feast\u2122",
                "category": "Feast Pizzas",
                "company": "Domino's",
                "votes": 0
            },
            {
                "id": "3c9fb7c3-43ae-4eb2-aa32-b3a7a4eb87d3",
                "name": "Pepperoni Lover's\u00ae Pizza",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "b7bc2d7f-2cee-4620-967d-9704567b7431",
                "name": "Meat Lover's\u00ae Pizza",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "03e60535-7810-4ff8-aa96-3e9de3c3b52c",
                "name": "Ultimate Cheese Lover's Pizza",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "39336cce-a5cc-4102-b9fe-84fb6e33228d",
                "name": "Veggie Lover's\u00ae Pizza",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "a7590d2c-1ef8-4157-816a-e03694560921",
                "name": "Supreme Pizza",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "002c0803-8699-4f6f-800f-5442d015b78e",
                "name": "BBQ Lover's\u2122",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "d8d69b45-e4bb-48d1-9f40-2480a2893762",
                "name": "Chicken Supreme Pizza",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "d0182a79-32be-4cd6-90d3-845a53ebbcf5",
                "name": "New Primo Meat Pizza",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "60df0c0f-fef8-438a-8ab4-1d15c4f8be61",
                "name": "Hawaiian Luau",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "c33dd0d5-a45e-4826-b5b0-0a17f47754eb",
                "name": "Super Supreme Pizza",
                "category": "Classic Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "ab1b235f-c24e-49e3-92cd-f9f9e7f4a231",
                "name": "Garden Party\u2122",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "7798d9f4-5b8a-44ed-8b7e-f4930466e31b",
                "name": "Old Fashioned Meatbrawl\u2122",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "5d5c4f24-c3c9-4686-a18c-8d5468c2d86a",
                "name": "Cock-a-doodle Bacon\u2122",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "820177f8-c4c8-46e2-92fe-a3c95b076764",
                "name": "Hot and Twisted\u2122",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "b74da310-371b-4707-983e-2a9cc03fdef0",
                "name": "Pretzel Piggy\u2122",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "9a93d853-c917-451d-87b3-dc00b71d9b95",
                "name": "BBQ Bacon Cheeseburger",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "06382c47-0de0-4609-bfbb-2f07f40da909",
                "name": "Giddy-Up BBQ Chicken\u2122",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "a06f20ec-515e-4a1d-add8-d14389b0ad2b",
                "name": "Buffalo State of Mind\u2122",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "da28779e-0829-4142-9850-15b5d89bda3e",
                "name": "Cherry Pepper Bombshell\u2122",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "c19ece3c-1c2f-4561-b5fc-6d84a4d46bdf",
                "name": "7-Alarm Fire\u2122",
                "category": "New Recipe Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "ed90b16f-20f4-414e-b132-2ccaf0892487",
                "name": "Skinny Beach\u2122",
                "category": "Skinny Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "02f684e6-130f-48fd-b280-0f1b9703d381",
                "name": "Skinny With A Kick\u2122",
                "category": "Skinny Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "b71b6b07-13bb-4cfd-be80-fa2cca6743fb",
                "name": "Skinny Italy",
                "category": "Skinny Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "e1992594-c6ce-43dc-9898-258bbe287638",
                "name": "Skinny Luau\u2122",
                "category": "Skinny Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            },
            {
                "id": "e69da1f3-6164-41c7-b6f8-3300039cdd99",
                "name": "Skinny Club\u2122",
                "category": "Skinny Pizzas",
                "company": "Pizza Hut",
                "votes": 0
            }
        ],
    };

    app.pizzaTemplate = function (pizza) {
        return `
            <div class="grow">
                <img src="https://logo.clearbit.com/${pizza.company.replaceAll(/[^a-zA-Z]+/g, '').toLowerCase()}.co.uk" class="w-full" />
            </div>
            <div class="w-5/6 text-left mx-6 pt-2">
                <h1 class="font-bold mb-2 lg:text-lg">
                    ${pizza.name}
                </h1>
                <p class="leading-relaxed">
                    ${pizza.company}
                </p>
            </div>
            <div class="flex flex-col grow">
                <button type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ml-auto w-1/4 hover:text-orange-500">
                        <path fill-rule="evenodd"
                        d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
                        clip-rule="evenodd" class="pointer-events-none" />
                    </svg>
                </button>
                <p class="text-center ml-auto w-1/4" id="votes">${pizza.votes}</p>
            </div>
        `;
    };

    app.latestVoteTemplate = function (createdAt, pizza) {
        return `
            <h1 class="font-bold">
                ${pizza.name}
            </h1>
            <p class="text-gray-400">
                ${dayjs(createdAt).utc('z').fromNow()}
            </p>
        `;
    };

    app.getVotes = async function () {
        const url = "https://pizza-rank-api.zainuddinsiddiqi.com/api/v1/votes";
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    app.postVote = async function (event, pizza) {
        const url = "https://pizza-rank-api.zainuddinsiddiqi.com/api/v1/votes";
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "pizza_id": pizza.id }),
        };
        const response = await fetch(url, requestOptions);
        if (response.ok) {
            event.target.classList.replace("hover:text-orange-500", "text-orange-500");
        }
    };

    app.setup = async function () {
        // load initial data
        const votes = await this.getVotes();
        const nextData = this.data.map((pizza) => ({
            ...pizza,
            ...votes.find(({ pizza_id }) => pizza_id === pizza.id),
        }));
        nextData.sort((a, b) => b.votes - a.votes);
        this.data = nextData;

        // render pizzas
        this.data.forEach((pizza, i) => {
            const tempDiv = document.createElement('div');
            tempDiv.className = i != this.data.length - 1 ? "flex border-b mx-auto p-5" : "flex border-b mx-auto mb-7 p-5";
            tempDiv.dataset.pizza = pizza.id;
            tempDiv.innerHTML = this.pizzaTemplate(pizza);
            tempDiv.getElementsByTagName('svg')[0].addEventListener('click', (event) => {
                event.preventDefault()
                event.stopPropagation()
                this.postVote(event, pizza)
            })
            this.pizzas.insertAdjacentElement('beforeend', tempDiv);
        })
    };

    var pusher = new Pusher("cdf94b4a20c19f28d667", {
        cluster: "eu",
    });

    var channel = pusher.subscribe("cache-recent-votes");

    var firstTime = true;

    channel.bind("vote-event", function (vote) {
        // render latest vote
        const pizza = app.data.find((pizza) => pizza.id === vote.pizza_id);
        const tempDiv = document.createElement('div');
        tempDiv.className = "px-3 my-2";
        tempDiv.innerHTML = app.latestVoteTemplate(vote.created_at, pizza);
        app.latestVotes.firstElementChild.insertAdjacentElement('afterend', tempDiv);
        if (app.latestVotes.childElementCount > 4) {
            app.latestVotes.removeChild(app.latestVotes.lastChild);
        }

        if (!firstTime) {
            // update data
            const nextData = app.data.map((pizza) => pizza.id === vote.pizza_id ? { ...pizza, votes: pizza.votes + 1 } : pizza);
            app.data = nextData;

            // render vote count
            const votesDiv = document.querySelector(`[data-pizza="${pizza.id}"] #votes`);
            const votes = parseInt(votesDiv.innerText) + 1;
            votesDiv.innerText = votes;
        }

        firstTime = false;
    });

    app.setup();
});
