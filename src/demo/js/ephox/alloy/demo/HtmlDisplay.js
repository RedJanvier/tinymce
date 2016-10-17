define(
  'ephox.alloy.demo.HtmlDisplay',

  [
    'ephox.alloy.api.GuiFactory',
    'ephox.sugar.api.Html',
    'ephox.wrap.JsBeautify'
  ],

  function (GuiFactory, Html, JsBeautify) {

    var section = function (gui, instructions, spec) {
      var information = {
        uiType: 'custom',
        dom: {
          tag: 'p',
          innerHtml: instructions
        }
      };

      var hr = { uiType: 'custom', dom: { tag: 'hr' } };

      var component = GuiFactory.build(spec);
      component.logSpec();
      console.log('Component APIs: ', component.apis());

    

      var display = GuiFactory.build({
        uiType: 'custom',
        dom: {
          tag: 'div',
          styles: {
            'padding-left': '100px',
            'padding-top': '20px',
            'padding-right': '100px',
            'border': '1px dashed green'
          }
        },
        components: [
          { built: component }
        ]
      });

      var htmlDump = Html.getOuter(component.element());
      var dump = {
        uiType: 'custom',
        dom: {
          tag: 'p',
          classes: [ 'html-display' ]
        },
        components: [
          { text: JsBeautify.html(htmlDump) }
        ]
      };

      var all = GuiFactory.build({
        uiType: 'container',
        components: [
          hr,
          information,
          { built: display },
          dump,
          hr
        ]
      });

      gui.add(all);

      return component;

    };

    return {
      section: section
    };
  }
);