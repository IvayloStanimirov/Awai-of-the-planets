import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {

  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    this._loading = document.getElementsByClassName('progress')[0];
    this._load();
    this._create();
    this._startLoading();
    this._stopLoading();

    this.arr = [];

    const box = document.createElement("div");
    

    box.innerHTML = this._render({
      name: "Placeholder",
      terrain: "placeholder",
      population: 0,
    });

    

    this.emit(Application.events.READY);
  }

  _render({
    name,
    terrain,
    population
  }) {
    return `
              <article class="media">
                <div class="media-left">
                  <figure class="image is-64x64">
                    <img src="${image}" alt="planet">
                  </figure>
                </div>
                <div class="media-content">
                  <div class="content">
                  <h4>${name}</h4>
                    <p>
                      <span class="tag">${terrain}</span> <span class="tag">${population}</span>
                      <br>
                    </p>
                  </div>
                </div>
              </article>
    `;
  }

  async _load() {
    await fetch('https://swapi.boom.dev/api/planets')
      .then(response => response.json())
      .then(data => {

        let next = data.next;
        let pages = parseInt(data.count / 10);

        for (let i = 1; i <= pages; i++) {
          next = next.substring(0, next.length - 1) + i;

          if (next !== null) {

            fetch(next)
              .then(response => response.json())
              .then(data => {

                data.results.map(j => {

                  if (!this.arr.find(o => o.name === j.name)) {
                    this.arr.push(j);

                    this._create(j.name, j.terrain, j.population)

                    const box = document.createElement("div");
                    box.classList.add("box");

                    box.innerHTML = this._render({
                      name: j.name,
                      terrain: j.terrain,
                      population: j.population,
                    });

                    document.body.querySelector(".main").appendChild(box);

                  }
                })
              });
          }
        }

      })
  }

  _create() {

    this._startLoading()
    this._load();
    this._stopLoading()

  }

  _startLoading() {
    this._loading.classList.remove('hide')
  }

  _stopLoading() {
    this._loading.classList.add('hide')
  }
}