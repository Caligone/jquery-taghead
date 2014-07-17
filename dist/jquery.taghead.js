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
        wrapperClass: '',
        tagClass: '',
        tagListWrapperClass: '',
        tagListClass: '',
        tagListItemClass: '',
        inputClass: '',
        removeClass: ''
      },
      text: {
        phAddTag: 'Add a tag'
      }
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend(true, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.tags = [];
        this.ids = [];
        this.init();
      }

      Plugin.prototype.init = function() {
        $(this.element).wrap("<span class='taghead-wrapper " + this.settings.style.wrapperClass + "'></span>");
        this.wrapper = $(this.element).parent()[0];
        $(this.wrapper).append("<input type='text' class='taghead-input " + this.settings.style.inputClass + "' placeholder='" + this.settings.text.phAddTag + "'/>");
        this.input = $(this.wrapper).find('.taghead-input')[0];
        $(this.wrapper).append("<span class='taghead-tag-list-wrapper " + this.settings.style.tagListWrapperClass + "'><ul class='taghead-tag-list " + this.settings.style.tagListClass + "'></ul></span>");
        this.list = $(this.wrapper).find('.taghead-tag-list')[0];
        $(this.element).hide();
        $(this.list).hide();
        $(this.input).on('keyup', (function(_this) {
          return function(event) {
            var data;
            if (event.keyCode === 13) {
              if (_this.settings.remote.forceValid) {
                return;
              }
              _this.addTag($(_this.input).val(), $(_this.input).val());
              $(_this.input).val('');
              $(_this.list).empty();
              $(_this.list).hide();
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
                var e, _i, _len;
                $(_this.list).empty();
                for (_i = 0, _len = data.length; _i < _len; _i++) {
                  e = data[_i];
                  $(_this.list).append("<li><a href='#' data-id='" + e[_this.settings.remote.storeData] + "' class='taghead-tag-list-item " + _this.settings.style.tagListItemClass + "'>" + e[_this.settings.remote.displayData] + "</a></li>");
                }
                return $(_this.list).show();
              });
            }
          };
        })(this));
        $(this.wrapper).on('click', "a.taghead-remove", (function(_this) {
          return function(event) {
            var label;
            label = $(event.target).parent().text().slice(0, -1);
            return _this.removeTag(label);
          };
        })(this));
        return $(this.wrapper).on('click', "a.taghead-tag-list-item", (function(_this) {
          return function(event) {
            _this.addTag($(event.target).text(), $(event.target).attr('data-id'));
            $(_this.list).empty();
            $(_this.list).hide();
            return $(_this.input).val('');
          };
        })(this));
      };

      Plugin.prototype.addTag = function(label, id) {
        if (!this.settings.allowDuplicates && (this.tags.indexOf(label) > -1 || this.ids.indexOf(id) > -1)) {
          return;
        }
        $(this.input).before("<span class='taghead-tag " + this.settings.style.tagClass + "' data-label='" + label + "' data-id=" + id + ">" + label + "<a href='#' class='taghead-remove " + this.settings.style.removeClass + "'>X</a></span>");
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
        parent = $(this.wrapper).find(".taghead-tag[data-label='" + label + "']");
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
