ype="text/javascript">
    (function() {
          var fn = function() {
            Bokeh.safely(function() {
              (function(root) {
                function embed_document(root) {
                  
                var render_items = [{"docid":"51a28049-340d-47d7-b457-8d8931bfe361","roots":{"1080":"772b207a-c6d3-481a-974d-6f63e436c091","1308":"17a7af48-634d-4496-95ef-9e2daa326543","1390":"e1525d7e-21d6-482a-bd0e-856df02face6","1455":"5f9d5a2b-b2d7-4865-994e-194a037500ef","1458":"2b2d4075-be06-4fb9-bdbb-d15c36612777"}}];
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