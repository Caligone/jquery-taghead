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
        inputClass: ''
      },
      text: {
        phAddTag: 'Add a tag'
      }
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend(true, this.settings, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.tags = [];
        this.ids = [];
        this.element = $(this.element);
        this._init();
      }

      Plugin.prototype._init = function() {
        var i, ids, labels, v, _i, _j, _len, _len1;
        this.element.addClass('th-original-input');
        this.element.wrap("<span class='th-wrapper " + this.settings.style.wrapperClass + "'></span>");
        this.wrapper = this.element.parent();
        this.wrapper.append("<input type='text' class='th-input " + this.settings.style.inputClass + "' placeholder='" + this.settings.text.phAddTag + "' autocomplete='off' spellcheck='false' dir='auto'/>");
        this.input = this.wrapper.find('.th-input');
        this.wrapper.append("<div class='th-tag-list-wrapper " + this.settings.style.tagListWrapperClass + "'><span class='th-tag-list " + this.settings.style.tagListClass + "'></span></div>");
        this.list = this.wrapper.find('.th-tag-list');
        this.list.hide();
        this.element.hide();
        if (this.element.val() !== '') {
          if (this.element.data('tags') && this.element.data('tags') !== '') {
            labels = this.element.data('tags').split(',');
            ids = this.element.val().split(',');
            for (i = _i = 0, _len = labels.length; _i < _len; i = ++_i) {
              v = labels[i];
              this.addTag(v, ids[i]);
            }
          } else {
            labels = this.element.val().split(',');
            for (_j = 0, _len1 = labels.length; _j < _len1; _j++) {
              v = labels[_j];
              this.addTag(v, v);
            }
          }
        }
        this.input.on('keyup', (function(_this) {
          return function(event) {
            var d;
            if (event.keyCode === 13) {
              if (_this.wrapper.find('.th-active').length > 0) {
                _this.addTag(_this.wrapper.find('.th-active').text(), _this.wrapper.find('.th-active').data('id'));
              } else {
                if (_this.settings.remote.forceValid) {
                  return;
                }
                _this.addTag(_this.input.val(), _this.input.val());
              }
              _this.input.val('');
              _this.list.empty();
              _this.list.hide();
            }
            if (event.keyCode === 38) {
              _this._keyboard(true);
              return;
            }
            if (event.keyCode === 40) {
              _this._keyboard(false);
              return;
            }
            if (_this.input.val().length < _this.settings.remote.minLength || event.keyCode === 27) {
              _this.list.empty();
              _this.list.hide();
              return;
            }
            if (_this.settings.remote.enable) {
              d = {};
              d[_this.settings.remote.sentParam] = _this.input.val();
              return $.ajax({
                type: _this.settings.remote.method,
                url: _this.settings.remote.source,
                data: d
              }).done(function(da) {
                var e, _k, _len2;
                _this.list.empty();
                for (_k = 0, _len2 = da.length; _k < _len2; _k++) {
                  e = da[_k];
                  _this.list.append("<a data-id='" + e[_this.settings.remote.storeData] + "' class='th-tag-list-item " + _this.settings.style.tagListItemClass + "'>" + e[_this.settings.remote.displayData] + "</a>");
                }
                _this.list.show();
                return _this.element.trigger('th.remoteresponse');
              });
            }
          };
        })(this));
        this.input.on('keydown', (function(_this) {
          return function(event) {
            if (event.keyCode === 8 && _this.input.val().length === 0) {
              return _this.removeTag(_this.tags[_this.tags.length - 1]);
            }
          };
        })(this));
        this.wrapper.on('click', "a.th-tag-link", (function(_this) {
          return function(event) {
            var label;
            label = $(event.target).text();
            _this.removeTag(label);
            return event.preventDefault();
          };
        })(this));
        this.wrapper.on('click', "a.th-tag-list-item", (function(_this) {
          return function(event) {
            _this.addTag($(event.target).text(), $(event.target).attr('data-id'));
            _this.list.empty();
            _this.list.hide();
            _this.input.val('');
            _this.element.trigger('th.clicktoadd');
            return event.preventDefault();
          };
        })(this));
        this.wrapper.on('mouseenter', "a.th-tag-list-item", function(event) {
          return $(this).addClass('th-active');
        });
        return this.wrapper.on('mouseleave', "a.th-tag-list-item", function(event) {
          return $(this).removeClass('th-active');
        });
      };

      Plugin.prototype.addTag = function(label, id) {
        if (!this.settings.allowDuplicates && (this.tags.indexOf(label) > -1 || this.ids.indexOf(id) > -1)) {
          return;
        }
        this.input.before("<span class='th-tag " + this.settings.style.tagClass + "' data-label='" + label + "' data-id=" + id + "><a href='#' class='th-tag-link'>" + label + "</a></span>");
        this.tags.push(label);
        this.ids.push(id);
        this.element.val(this.ids.join(','));
        return this.element.trigger('th.addtag');
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
        parent = this.wrapper.find(".th-tag[data-label='" + label + "']");
        if (parent.hasClass(this.settings.style.tagClass)) {
          parent.remove();
        } else {
          return;
        }
        this.element.val(this.ids.join(','));
        return this.element.trigger('th.removetag');
      };

      Plugin.prototype.clearTag = function() {
        var _results;
        _results = [];
        while (this.tags.length > 0) {
          _results.push(this.removeTag(this.tags[0], this.ids[0]));
        }
        return _results;
      };

      Plugin.prototype._keyboard = function(up) {
        var el;
        if (this.input.val().length < this.settings.remote.minLength) {
          return;
        }
        if (this.wrapper.find('.th-active').length > 0) {
          el = this.wrapper.find('.th-active');
          if (up) {
            this.wrapper.find('.th-active').prev().addClass('th-active');
          } else {
            this.wrapper.find('.th-active').next().addClass('th-active');
          }
          return el.removeClass('th-active');
        } else {
          if (up) {
            return this.wrapper.find('.th-tag-list-item').last().addClass('th-active');
          } else {
            return this.wrapper.find('.th-tag-list-item').first().addClass('th-active');
          }
        }
      };

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        var opt;
        if (!$.data(this, "plugin_" + pluginName)) {
          opt = $.extend(true, defaults, options);
          return $.data(this, "plugin_" + pluginName, new Plugin(this, opt));
        }
      }).data("plugin_" + pluginName);
    };
  })(jQuery, window, document);

}).call(this);
