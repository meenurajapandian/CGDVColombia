ype="text/javascript">
    (function() {
          var fn = function() {
            Bokeh.safely(function() {
              (function(root) {
                function embed_document(root) {
                  
                var render_items = [{"docid":"fade7e5a-c5b6-4f17-8606-47f3bc49c195","roots":{"1080":"5460938b-256d-415d-84ae-b4dfab854601","1308":"2198dc31-caec-45a0-963a-1d4b2e76022b","1390":"c63667d2-632b-4309-9b7b-e999119b5f7e","1455":"37ca1019-b1ec-48d1-8f5f-3c428a873124","1458":"32588682-f38c-42e7-8873-201dc3adecee"}}];
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