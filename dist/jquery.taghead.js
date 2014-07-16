(function() {
  (function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = "taghead";
    defaults = {
      remote: {
        enable: false,
        source: '',
        method: 'GET',
        sentParam: 'value',
        displayData: 'value',
        storeData: 'value',
        minLength: 2,
        forceValid: false
      },
      allowDuplicates: false,
      style: {
        wrapperClass: 'taghead-wrapper',
        tagClass: 'taghead-tag',
        tagListWrapperClass: 'taghead-tag-list-wrapper',
        tagListClass: 'taghead-tag-list',
        tagListItemClass: 'taghead-tag-list-item',
        inputClass: 'taghead-input',
        removeClass: 'taghead-remove'
      },
      text: {
        phAddTag: 'Add a tag'
      }
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.tags = [];
        this.ids = [];
        this.init();
      }

      Plugin.prototype.init = function() {
        $(this.element).wrap("<span class='" + this.settings.style.wrapperClass + "' id='taghead-wrapper'></span>");
        this.wrapper = $('#taghead-wrapper')[0];
        $(this.wrapper).append("<input type='text' class='" + this.settings.style.inputClass + "' id='taghead-input' placeholder='" + this.settings.text.phAddTag + "'/>");
        this.input = $('#taghead-input')[0];
        $(this.wrapper).append("<span class='" + this.settings.style.tagListWrapperClass + "' id='taghead-tag-list-wrapper'><ul class='" + this.settings.style.tagListClass + "' id='taghead-tag-list'></ul></span>");
        this.list = $('#taghead-tag-list')[0];
        $(this.element).hide();
        $(this.input).on('keyup', (function(_this) {
          return function(event) {
            var data;
            if (event.keyCode === 13) {
              if (_this.settings.remote.forceValid) {
                return;
              }
              _this.addTag($(_this.input).val(), $(_this.input).val());
              $(_this.input).val('');
            } else {
              if (event.keyCode === 8 && $(_this.input).val() === '') {
                _this.removeTag(_this.tags[_this.tags.length - 1]);
              }
            }
            if ($(_this.input).val().length < _this.settings.remote.minLength) {
              return;
            }
            if (_this.settings.remote.enable) {
              data = {};
              data[_this.settings.remote.sentParam] = $(_this.input).val();
              return $.ajax({
                type: _this.settings.remote.method,
                url: _this.settings.remote.source,
                data: data
              }).done(function(data) {
                var e, _i, _len, _results;
                $(_this.list).empty();
                _results = [];
                for (_i = 0, _len = data.length; _i < _len; _i++) {
                  e = data[_i];
                  _results.push($(_this.list).append("<li><a href='#' data-id='" + e[_this.settings.remote.storeData] + "' class='" + _this.settings.style.tagListItemClass + "'>" + e[_this.settings.remote.displayData] + "</a></li>"));
                }
                return _results;
              });
            }
          };
        })(this));
        $(document).on('click', "a." + this.settings.style.removeClass, (function(_this) {
          return function(event) {
            var label;
            label = $(event.target).parent().text().slice(0, -1);
            return _this.removeTag(label);
          };
        })(this));
        return $(document).on('click', "a." + this.settings.style.tagListItemClass, (function(_this) {
          return function(event) {
            return _this.addTag($(event.target).text(), $(event.target).attr('data-id'));
          };
        })(this));
      };

      Plugin.prototype.addTag = function(label, id) {
        if (!this.settings.allowDuplicates && (this.tags.indexOf(label) > -1 || this.ids.indexOf(id) > -1)) {
          return;
        }
        $(this.wrapper).append("<span class='" + this.settings.style.tagClass + "' data-label='" + label + "' data-id=" + id + ">" + label + "<a href='#' class='" + this.settings.style.removeClass + "'>X</a></span>");
        this.tags.push(label);
        this.ids.push(id);
        return $(this.element).val(this.ids.join(','));
      };

      Plugin.prototype.removeTag = function(label, id) {
        var index, parent;
        if ((id != null)) {
          index = this.ids.indexOf(id);
        } else {
          index = this.tags.indexOf(label);
        }
        if (index > -1) {
          this.tags.splice(index, 1);
          this.ids.splice(index, 1);
        } else {
          return;
        }
        parent = $("." + this.settings.style.tagClass + "[data-label='" + label + "']");
        if (parent.hasClass(this.settings.style.tagClass)) {
          parent.remove();
        } else {
          return;
        }
        return $(this.element).val(this.ids.join(','));
      };

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
