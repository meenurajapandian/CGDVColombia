ype="text/javascript">
    (function() {
          var fn = function() {
            Bokeh.safely(function() {
              (function(root) {
                function embed_document(root) {
                  
                var render_items = [{"docid":"7d4cdb62-fec2-49b5-a9a5-025069aca540","roots":{"1080":"30929a4d-7bdf-49a0-9351-4dac8769ef5f","1244":"4a9c8b2f-24a4-4b97-b95e-859619b9f8fe"}}];
                root.Bokeh.embed.embed_items(docs_json, render_items);
              
                }
                if (root.Bokeh !== undefined) {
                  embed_document(root);
                } else {
                  var attempts = 0;
                  var timer = setInterval(function(root) {
                    if (root.Bokeh !== undefined) {
                      clearInterval(timer);
                      embed_document(root);
                    } else {
                      attempts++;
                      if (attempts > 100) {
                        clearInterval(timer);
                        console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");
                      }
                    }
                  }, 10, root)
                }
              })(window);
            });
          };
          if (document.readyState != "loading") fn();
          else document.addEventListener("DOMContentLoaded", fn);
        })();