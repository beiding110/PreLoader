(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.PreLoader = factory());
}(this, function () { 'use strict';

    function PreLoader(arr) {
        this.init(arr);
    };

    PreLoader.prototype = {
        init: function(arr) {
            this.$waiting = arr;
            this.$pending = [];
            this.$complete = [];
            this.$error = [];
            this.$sum = arr.length;

            this.updateHandler = function() {};
            this.completeHandler = function() {};
            this.errorHandler = function() {};

            var that = this;
            
            arr.reduce(function(reArr, item) {
                if(!~reArr.indexOf(item)) {
                    reArr.push(item)
                };
                return reArr;
            }, []).forEach(function(item) {
                that.preloadItem(item);
            });
        },
        preloadItem: function(path) {
            function toggleArr(arr, item) {
                var index = -1;
                if(index = arr.indexOf(item), ~index) {
                    arr.splice(index, 1);
                } else {
                    arr.push(item);
                };
            };

            function doneHandler(el, mapFile, cb) {
                toggleArr(this.$pending, path);

                cb && cb({
                    path: path,
                    el: el,
                    map: mapFile,
                    waiting: this.$waiting.length,
                    pending: this.$pending.length,
                    complete: this.$complete.length,
                    error: this.$error.length,
                    progress: Number((this.$complete.length / this.$sum).toFixed(2)),
                })

                if(!this.$waiting.length && !this.$pending.length) {
                    this.completeHandler()
                };
            }

            setTimeout(function() {
                var mapFile = this.mapFileType(path)

                var el = mapFile.builder();
                el[mapFile.prop] = path;

                toggleArr(this.$waiting, path);
                toggleArr(this.$pending, path);

                el[mapFile.event[0] || 'onload'] = function() {
                    toggleArr(this.$complete, path);

                    doneHandler.call(this, el, mapFile, this.updateHandler);
                }.bind(this);

                el[mapFile.event[1] || 'onerror'] = function() {
                    toggleArr(this.$error, path);

                    doneHandler.call(this, el, mapFile, this.errorHandler);
                }.bind(this);

                mapFile.load && mapFile.load(el);

            }.bind(this), 0)
        },
        mapFileType: function(path) {
            function setStyle(el) {
                el.style.position = 'absolute';
                el.style.left = '0';
                el.style.bottom = '0';
                el.style.width = '0';
                el.style.height = '0';
                el.style.border = '0';

                return el;
            }

            var whiteList = [
                {
                    type: 'image',
                    builder: function() {
                        return new Image();
                    },
                    prop: 'src',
                    event: [],
                    reg: /(jpg|jpeg|png|gif)$/
                },
                {
                    type: 'video',
                    builder: function() {
                        var el = document.createElement('video');
                        setStyle(el);
                        return el;
                    },
                    load: function(el) {
                        document.body.appendChild(el);
                    },
                    prop: 'src',
                    event: ['oncanplay', 'onerror'],
                    reg: /(mp4)$/
                },
                {
                    type: 'audio',
                    builder: function() {
                        var el = document.createElement('audio');
                        setStyle(el);
                        return el;
                    },
                    load: function(el) {
                        document.body.appendChild(el);
                    },
                    
                    prop: 'src',
                    event: ['oncanplay', 'onerror'],
                    reg: /(mp3)$/
                },
            ];

            for(var i = 0; i < whiteList.length; i++) {
                var item = whiteList[i];
                if(item.reg.test(path)) {
                    return item;
                };
            };

            return {
                type: 'other',
                builder: function() {
                    var el = document.createElement('iframe');
                    setStyle(el);

                    return el;
                },
                load: function(el) {
                    document.body.appendChild(el);
                },
                prop: 'src',
                event: [],
            };
        },
        update: function(cb) {
            this.updateHandler = cb || function() {};
            return this;
        },
        complete: function(cb) {
            this.completeHandler = cb || function() {};
            return this;
        },
        error: function(cb) {
            this.errorHandler = cb || function() {};
            return this;
        }
    };

    return PreLoader;

}));