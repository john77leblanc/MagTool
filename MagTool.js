// MagTool 1.1
// By Johnathan LeBlanc

let $j = jQuery.noConflict();

console.log("MagTool opened");

$j(function(){
  if ($j("#mag").length === 0) {
    // Generate HTML

    let tracker = $j("body").find("#preso").parent();
    tracker.append(
      "<div id='mag' class='mag-item'>" +
        "<div id='controls' class='mag-item'>" +
          "<button id='mag-toggle' class='mag-item active'>MagTool On/Off</button>" +
          "<div class='mag-controls'>" +
            "<span class='mag-item'>Magnification: </span>" +
            "<span id='size' class='mag-item' style='margin-right: 15px;'></span>" +
            "<button id='mag-up' class='mag-item'>+</button>" +
            "<button id='mag-down' class='mag-item'>-</button>" +
          "</div>" +
          "<div class='mag-controls'>" +
            "<span class='mag-item'>Frame Size: </span>" +
            "<span id='frame-size' class='mag-item' style='margin-right: 15px;'></span>" +
            "<button id='frame-up' class='mag-item'>+</button>" +
            "<button id='frame-down' class='mag-item'>-</button>" +
          "</div>" +
        "</div>" +
      "</div>"
    );

    //--------------------
    // Frame Initializer
    //--------------------

    let createFrame = () => {
        return  "<div id='frame' class='mag-item active'>" +
                  "<div id='frame-content' class='mag-item'></div>" +
                "</div>"
    }

    let frameContent = () => {
        return $j("#frame-content");
    }

    let frameDataCSS = () => {
        return {
            "position":"absolute",
            "width":frameSize+"px",
            "height":frameSize+"px",
            "top": MouseY(event.pageY) - (frameSize/2) + "px",
            "left": MouseX(event.pageX) - (frameSize/2) + "px",
            "background":"white",
            "border":"1px solid black",
            "overflow":"hidden",
            "pointer-events":"none",
            "z-index":"999998"
        }
    }

    let frameContentCSS = () => {
        return {
            "transform":"scale(2,2)",
            "transform-origin":"0 0",
            "position":"absolute",
            "width":tracker.width() * scale + "px",
            "height":tracker.height() * scale + "px",
            "cursor":"default",
            "pointer-events":"none"
        }
    }

    function assignFrame() {
        mag.before(createFrame);
        return $j("#frame");
    }

    //--------------------
    // Assign Variables
    //--------------------

    let mag = $j("#mag");
    let magControls = $j("#controls");
    let magToggle = $j("#mag-toggle");
    let magOpen = true;
    let magUp = $j("#mag-up");
    let magDown = $j("#mag-down");
    let frameUp = $j("#frame-up");
    let frameSize_text = $j("#frame-size");
    let frameDown = $j("#frame-down");
    let size = $j("#size");
    let frame = {
        data: assignFrame(),
        content: frameContent(),
        dataCSS: function() {
            return {
                "position":"absolute",
                "width":frameSize+"px",
                "height":frameSize+"px",
                "top": MouseY(event.pageY) - (frameSize/2) + "px",
                "left": MouseX(event.pageX) - (frameSize/2) + "px",
                "background":"white",
                "border":"1px solid black",
                "overflow":"hidden",
                "pointer-events":"none",
                "z-index":"999998"
              }
        },
        contentCSS: function() {
            return {
                "transform":"scale(2,2)",
                "transform-origin":"0 0",
                "position":"absolute",
                "width":tracker.width() * scale + "px",
                "height":tracker.height() * scale + "px",
                "cursor":"default",
                "pointer-events":"none"
              }
        },
        assignCSS: function() {
            this.data.css(this.dataCSS());
            this.content.css(this.contentCSS());
        }
    };
    let frameSize = 300;
    let scale = 2;
    let max_scale = 10;
    let min_scale = 1;
    let max_frame = 1000;
    let min_frame = 100;
    let dragging = false;
    let dimension = frameSize/2;

    //-------------
    // Set Styling
    //-------------

    size.text(scale * 100 + "%");
    frameSize_text.text(frameSize + "px");

    frame.assignCSS();

    mag.css({
      "position":"absolute",
      "background":"#ffffff",
      "padding":"5px",
      "top": 0 + "px",
      "left": tracker.width() - frameSize + "px",
      "border-radius":"3px",
      "box-shadow":"0 0 5px #999999",
      "z-index":"999999"
    });

    //---------------------------
    // Add Content To Frame
    //---------------------------

    let body = $j("#preso").clone().find(".mag-item").remove().end().find("*").each(function(){
      $j(this).removeAttr("data-reactid");
      if ( $j(this).attr("style") ) {
        let styles = $j(this).attr("style");
        $j(this).attr("style", styles + " pointer-events: none !important");
      } else {
        $j(this).attr("style","pointer-events: none !important");
      }
    }).end();

    frame.content.html(body.html());

    //------------
    // Functions
    //------------

    function MouseX(posX){
      return (posX);
    };

    function MouseY(posY){
      return (posY);
    };

    // Detect DOM Changes and Lightboxes

    function CheckDOMUpdate(override=false){
      let body_top = "-25%";
      let body_left = "-25%";
      let container_size = "100%";

      let BodyTrim = function(body,update=false) {
        body.find("iframe").attr("style","pointer-events: none !important");
        let trim = body.clone();
        if (update == true) {
          trim = trim.find(".mag-item").remove().end().find("*").each(function(){
            $j(this).removeAttr("data-reactid");
            if ($j(this).attr("style") && $j(this).attr("style") != "pointer-events: none !important") {
              let styles = $j(this).attr("style");
              $j(this).attr("style", styles + " pointer-events: none !important");
            } else {
              $j(this).attr("style","pointer-events: none !important");
            }
          }).end();
        }

        trim = trim.find("#overlay-container").css({
          "width":container_size,
          "height":container_size,
          "top":body_top,
          "left":body_left
        }).find(".lightbox-wrapper").css({
          "width":container_size,
          "height":container_size
        }).end().end();

        return trim.html();
      }

      let body_old = BodyTrim($j("#frame-content"));
      let body_update = BodyTrim($j("#presentation-container"),true);

      if (body_old !== body_update || override == true) {
        frame.content.html(body_update);
        console.log("DOM Updated");
      }
    }

    mag.on('mousedown',function(){
      dragging = true;
      clickPosX = MouseX(event.pageX);
      clickPosY = MouseY(event.pageY);
    });

    $j(window).on('mouseup',function(){
      dragging = false;
    });

    magToggle.on('click',function(){
      magOpen = !magOpen;
      console.log("Mag Open: ", magOpen);
      if (!magOpen) frame.data.remove();
      else {
        frame.data = assignFrame();
        frame.content = frameContent();
        frame.assignCSS();
      }
      $j(this).toggleClass("active inactive");
    });

    magUp.on('click',function(){
      if (magOpen) {
        if (scale < max_scale) {
          scale += 0.5;
          size.text(scale * 100 + "%");
          dimension = frameSize/scale;
          CheckDOMUpdate(true);
        }
      }
    });

    magDown.on('click',function(){
      if (magOpen) {
        if (scale > min_scale) {
          scale -= 0.5;
          size.text(scale * 100 + "%");
          dimension = frameSize/scale;
          CheckDOMUpdate(true);
        }
      }
    });

    frameUp.on('click',function(){
      if (magOpen) {
        if (frameSize < max_frame) {
          frameSize += 50;
          frameSize_text.text(frameSize + "px");
          frame.data.css({
            "width":frameSize+"px",
            "height":frameSize+"px",
            "top": MouseY(event.pageY) - (frameSize/2) + "px",
            "left": MouseX(event.pageX) - (frameSize/2) + "px",
           });
          dimension = frameSize/scale;
          CheckDOMUpdate(true);
        }
      }
    });

    frameDown.on('click',function(){
      if (frameSize > min_frame) {
        frameSize -= 50;
        frameSize_text.text(frameSize + "px");
        frame.data.css({
          "width":frameSize+"px",
          "height":frameSize+"px",
          "top": MouseY(event.pageY) - (frameSize/2) + "px",
          "left": MouseX(event.pageX) - (frameSize/2) + "px",
         });
        dimension = frameSize/scale;
        CheckDOMUpdate(true);
      }
    });

    tracker.mousemove(function(event){
      
    if (dragging && ((MouseX(event.pageX) != clickPosX) || (MouseY(event.pageY) != clickPosY))) {
        mag.css({
        "top": MouseY(event.pageY) - 5 + "px",
        "left": MouseX(event.pageX) - 120 + "px",
        });
    }

    if (magOpen) {
        frame.data.css({
          "top": (MouseY(event.pageY) - (frameSize/2)) + "px",
          "left": (MouseX(event.pageX) - (frameSize/2)) + "px"
        });

        let posX = (MouseX(event.pageX) - (dimension/2)) * scale * -1;
        let posY = (MouseY(event.pageY) - (dimension/2)) * scale * -1;

        frame.content.css({
          "transform": "scale(" + scale + ", " + scale + ")",
          "left": posX + "px",
          "top": posY + "px"
        });

        CheckDOMUpdate();
      }
    });
  } // if statement
});