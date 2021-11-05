// MagTool v2.1
// By Johnathan LeBlanc

let bind = "body";

function MagTool() {
console.log("MagTool opened");

if (document.querySelector("#mag-controls") == null) {
  const MagControls = () => {
    this.preso = () => document.querySelector(bind);

    this.mouseData = {
      x: 0,
      y: 0
    };

    this.data = ({
      open: true,
      refresh: null,
      clone: document.createElement("div"), // Starting point for comparison
      magnification: 2,
      maxMagnification: 10,
      minMagnification: 1,
      frameSize: 300,
      maxFrameSize: 1000,
      minFrameSize: 100,
      dragging: false,
      dimension: () => this.data.frameSize / 2
    });

    this.selectors = {
      id:     "m-id",
      class:  "m-class",
      click:  "m-click",
      event:  "m-event"
    };

    this.controlSelectors = ({
      selector:           () => document.querySelector("#mag-controls"),
      magnificationText:  () => document.querySelector("#size"),
      frameSizeText:      () => document.querySelector("#mag-frame-size"),
      buttons: {
        toggle:     () => document.querySelector("#mag-toggle"),
        magUp:      () => document.querySelector("#mag-up"),
        magDown:    () => document.querySelector("#mag-down"),
        frameUp:    () => document.querySelector("#mag-frame-up"),
        frameDown:  () => document.querySelector("#mag-frame-down")
      }
    });

    this.frameSelectors = ({
      frame:    () => document.querySelector("#mag-frame"),
      content:  () => document.querySelector("#mag-frame-content")
    });

    // <div id="mag-controls">
    this.controlTemplate = () => {
      let el = document.createElement("div");
        el.id = "mag-controls";
        el.setAttribute("m-class","control-panel");
        el.innerHTML = `
          <div id="controls">
            <div m-class="mag-controls">
              <div m-class="mag-data title">
                <span m-class="mag-data-static">MagTool</span>
              </div>
              <div></div>
              <button id="mag-close" m-class="mag-button" m-hover m-event="click,magClose">&times;</button>
            </div>
            <div m-class="note">
              <span>Click and drag this panel to move it around.</span>
            </div>
            <div m-class="mag-controls">
              <div m-class="mag-data">
                <span m-class="mag-data-static">Toggle: </span>
              </div>
              <button id="mag-toggle" m-class="mag-button full" m-hover m-event="click,toggleFrame">ON</button>
            </div>
            <div m-class="mag-controls">
              <div m-class="mag-data">
                <span m-class="mag-data-static">Magnification: </span>
                <span id="size" m-class="mag-data-text"></span>
              </div>
              <button id="mag-up"   m-class="mag-button" m-hover m-event="click,magnificationUp">+</button>
              <button id="mag-down" m-class="mag-button" m-hover m-event="click,magnificationDown">-</button>
            </div>
            <div m-class="mag-controls">
              <div m-class="mag-data">
                <span m-class="mag-data-static">Frame Size: </span>
                <span id="mag-frame-size" m-class="mag-data-text"></span>
              </div>
              <button id="mag-frame-up"   m-class="mag-button" m-hover m-event="click,frameSizeUp">+</button>
              <button id="mag-frame-down" m-class="mag-button" m-hover m-event="click,frameSizeDown">-</button>
            </div>
          </div>`;

      return el;
    }

    // <div id="mag-frame">
    this.frameTemplate = () => {
      let el = document.createElement("div");
        el.id = "mag-frame";
        el.innerHTML = "<div id='mag-frame-content' style='pointer-events: none;'></div>";
      return el;
    }

    this.css = ({
      "title": {
        "font-size": "16px"
      },
      "control-panel": {
        "font-family": "'Open Sans' sans-serif",
        "position": "absolute",
        "background": "#ffffff",
        "padding": "5px",
        "top": 0 + "px",
        "left": this.preso().offsetWidth - this.data.frameSize + "px",
        "border-radius": "3px",
        "box-shadow": "0 0 5px #999999",
        "z-index": "999999",
      },
      "note" : {
        "font-style": "italic",
        "padding-bottom": "5px",
        "border-bottom": "2px solid #999999",
        "margin-bottom": "10px",
      },
      "mag-data": {

      },
      "mag-data-static": {
        "font-weight": 600,
      },
      "mag-data-text": {

      },
      "mag-controls": {
        "display": "grid",
        "grid-template-columns": "50% 25% 25%",
        "margin": "5px 0"
      },
      "mag-button": {
        "cursor": "pointer",
        "display": "inline-block",
        "padding": "5px 10px",
        "border-radius": "3px",
        "margin": "0 2px",
        "color": "#333",
        "background-color": "#eee",
        "transition": "color 0.3s, background-color 0.3s"
      },
      "full": {
        "grid-column": "span 2"
      },
      "frameCSS": {
        "position":       "absolute",
        "width":          `${this.data.frameSize}px`,
        "height":         `${this.data.frameSize}px`,
        "top":            `${this.mouseData.y - (this.data.frameSize / 2)}px`,
        "left":           `${this.mouseData.x - (this.data.frameSize / 2)}px`,
        "background":     "white",
        "border":         "1px solid black",
        "overflow":       "hidden",
        "pointer-events": "none",
        "z-index":        "999998"
      },
      "frameContentCSS": {
        "transform":        `scale(${this.data.magnification}, ${this.data.magnification})`,
        "transform-origin": "0 0",
        "position":         "absolute",
        "width":            `${this.preso().offsetWidth * this.data.magnification}px`,
        "height":           `${this.preso().offsetHeight * this.data.magnification}px`,
        "left":             `${(this.mouseData.x - (this.data.dimension()/2) * this.data.magnification * -1)}px`,
        "top":              `${(this.mouseData.y - (this.data.dimension()/2) * this.data.magnification * -1)}px`,
        "cursor":           "default",
        "pointer-events":   "none"
      }
    });

    this.cssHover = ({
      "mag-button": {
        "color" : "#eee",
        "background-color": "#333"
      }
    });

    // MagTool control panel functions
    this.magMethods = ({
      magClose: () => {
        this.methods.destroy();
      },
      toggleFrame: () => {
        this.data.open = !this.data.open;
        console.log("Mag Open: ", this.data.open);

        if (this.data.open == true) {
          this.controlSelectors.buttons.toggle().innerHTML = "ON";
          this.frameSelectors.frame().style.display = "block";
          this.privateMethods.setRefresh();
        } else {
          this.controlSelectors.buttons.toggle().innerHTML = "OFF";
          this.frameSelectors.frame().style.display = "none";
          this.privateMethods.clearRefresh();
        }
      },
      magnificationUp: () => {
        if (this.data.magnification < this.data.maxMagnification) this.data.magnification += 0.5;
        this.privateMethods.adjustMagnification();
      },
      magnificationDown: () => {
        if (this.data.magnification > this.data.minMagnification) this.data.magnification -= 0.5;
        this.privateMethods.adjustMagnification();
      },
      frameSizeUp: () => {
        if (this.data.frameSize < this.data.maxFrameSize) this.data.frameSize += 50;
        this.privateMethods.adjustFrameSize();
      },
      frameSizeDown: () => {
        if (this.data.frameSize > this.data.minFrameSize) this.data.frameSize -= 50;
        this.privateMethods.adjustFrameSize();
      },
    });

    this.privateMethods = ({
      mouseMove: e => {
        this.privateMethods.updateMouseData(e);
        this.privateMethods.checkDragging();
        this.privateMethods.positionFrame();
      },
      updateMouseData: e => {
        this.mouseData.x = e.pageX;
        this.mouseData.y = e.pageY;
      },
      setRefresh: () => {
        this.data.refresh = setInterval(this.privateMethods.positionFrameContent, 10);
      },
      clearRefresh: () => {
        clearInterval(this.data.refresh);
      },
      checkDragging: () => {
        if (this.data.dragging) {
          let css = {
            "top": `${this.mouseData.y}px`,
            "left": `${this.mouseData.x}px`
          }
          this.privateMethods.assignCSS(
            this.controlSelectors.selector(),
            css
          );
        }
      },
      assignCSS: (element, css) => {
        for (let key in css) {
          element.style[key] = css[key];
        }
      },
      assignMethods: () => {
        document.querySelectorAll(`[${this.selectors.event}]`).forEach(element => {
          let event = element.getAttribute(this.selectors.event).split(",");
          element.addEventListener(event[0].trim(), this.magMethods[event[1].trim()]);
        });
      },
      applyFrameSizeCSS: () => {
        let frameCSS = {
          "width":  `${this.data.frameSize}px`,
          "height": `${this.data.frameSize}px`,
          "top":    `${this.mouseData.y - (this.data.frameSize/2)}px`,
          "left":   `${this.mouseData.x - (this.data.frameSize/2)}px`
        }
        this.privateMethods.assignCSS(
          this.frameSelectors.frame(),
          frameCSS
        );
      },
      adjustMagnification: () => {
        this.controlSelectors.magnificationText().innerHTML = `${this.data.magnification * 100}%`;
        this.privateMethods.positionFrame();
      },
      adjustFrameSize: () => {
        this.privateMethods.applyFrameSizeCSS();
        this.controlSelectors.frameSizeText().innerHTML = `${this.data.frameSize}px`;
        this.privateMethods.positionFrame();
      },
      positionFrame: () => {
        if (this.data.open) {
          let frameCSS = {
            "top":    `${this.mouseData.y - (this.data.frameSize/2)}px`,
            "left":   `${this.mouseData.x - (this.data.frameSize/2)}px`
          }
          this.privateMethods.assignCSS(
            this.frameSelectors.frame(),
            frameCSS
          );
        }
      },
      positionFrameContent: () => {
        let newClone = this.preso().cloneNode(true);
        newClone.querySelectorAll("*").forEach(el => {
          el.style.pointerEvents = "none";
        })

        if (newClone.innerHTML != this.data.clone.innerHTML) {
          this.data.clone = newClone;
          this.frameSelectors.content().innerHTML = "";
          this.frameSelectors.content().appendChild(this.data.clone);
        }

        let frameContentCSS = {
          "transform":  `scale(${this.data.magnification}, ${this.data.magnification})`,
          "left": `${(this.mouseData.x - this.data.dimension() / this.data.magnification) * this.data.magnification * -1}px`,
          "top":  `${(this.mouseData.y - this.data.dimension() / this.data.magnification) * this.data.magnification * -1}px`,
        }

        this.privateMethods.assignCSS(
          this.frameSelectors.content(),
          frameContentCSS
        );
      }
    });

    return this.methods = ({
      init: () => {
        // Insert control panel
        this.preso().parentNode.insertBefore(
          this.controlTemplate(),
          this.preso.nextSibling
        );

        // Set styling
        document.querySelectorAll("[m-class]").forEach(el => {
          el.getAttribute("m-class").split(" ").forEach(i => {
            this.privateMethods.assignCSS(
              el,
              this.css[i]
            );
          });
        })

        // Set hover styles
        document.querySelectorAll("[m-hover]").forEach(el => {
          el.addEventListener("mouseover", () => {
            el.getAttribute("m-class").split(" ").forEach(i => {
              if (this.cssHover[i] != undefined) {
                this.privateMethods.assignCSS(
                  el,
                  this.cssHover[i]
                );
              }
            });
          });
          el.addEventListener("mouseleave", () => {
            el.getAttribute("m-class").split(" ").forEach(i => {
              if (this.css[i] != undefined) {
                this.privateMethods.assignCSS(
                  el,
                  this.css[i]
                );
              }
            });
          });
        });

        this.controlSelectors.magnificationText().innerHTML = `${this.data.magnification * 100}%`;
        this.controlSelectors.frameSizeText().innerHTML = `${this.data.frameSize}px`;

        // Assign button functions
        this.privateMethods.assignMethods();

        // Insert drag controls
        this.controlSelectors.selector().addEventListener("mousedown", () => {
          this.data.dragging = true;
        });

        // Assign frame tracking and drag checking
        window.addEventListener("mousemove", this.privateMethods.mouseMove);

        window.addEventListener("mouseup", () => {
          this.data.dragging = false;
        });

        // Insert frame
        this.methods.buildFrame();

        // Start frame content positioning
        this.privateMethods.setRefresh();
        console.log("MagTool opened.");
      },
      buildFrame: () => {
        this.controlSelectors.selector().parentNode.insertBefore(
          this.frameTemplate(),
          this.controlSelectors.selector()
        );
        this.privateMethods.assignCSS(
          this.frameSelectors.frame(),
          this.css.frameCSS
        );
        this.privateMethods.assignCSS(
          this.frameSelectors.content(),
          this.css.frameContentCSS
        );
      },
      destroy: () => {
        this.data.open = false;
        document.querySelector("body").removeEventListener("mousemove", this.privateMethods.mouseMove);
        this.privateMethods.clearRefresh();
        this.controlSelectors.selector().remove();
        this.frameSelectors.frame().remove();
        console.log("MagTool destroyed.");
        return;
      },
      data:     this.data,
      controls: this.controlSelectors,
      frame:    this.frameSelectors
    });
  }

  window.magTool = MagControls();
  window.magTool.init();
} else {
  window.magTool.destroy();
}
}


let button = document.createElement("button");
    button.innerText = "Start MagTool";
    button.setAttribute("style","position: absolute; z-index: 999999;");
    button.addEventListener("click", MagTool);

document.querySelector(bind).insertBefore(button, document.querySelector(bind).firstChild);