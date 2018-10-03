var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function jsx(tag, attrs, children) {
    var element = document.createElement(tag);
    for (var name_1 in attrs) {
        if (name_1 && attrs.hasOwnProperty(name_1)) {
            var value = attrs[name_1];
            if (value === true)
                element.setAttribute(name_1, name_1);
            else if (value !== false && value != null)
                element.setAttribute(name_1, value.toString());
        }
    }
    for (var i = 2; i < arguments.length; i++) {
        var child = arguments[i];
        var childNode = child.nodeType == null
            ? document.createTextNode(child.toString())
            : child;
        element.appendChild(childNode);
    }
    return element;
}
var app;
(function (app) {
    var ui;
    (function (ui) {
        function setSize(el, width, height) {
            el.style.width = width + "px";
            el.style.height = height + "px";
        }
        ui.setSize = setSize;
        function img(src) {
            src += "?v=" + app.version;
            var img = jsx("img", { src: src });
            img.style.width = "100%";
            img.style.width = "100%";
            return img;
        }
        ui.img = img;
        function fitSize(target, width, height, baseWidth, baseHeight) {
            var mw = width / baseWidth;
            var mh = height / baseHeight;
            var w = 0;
            var h = 0;
            if (mw > mh) {
                h = height;
                w = baseWidth * h / baseHeight;
            }
            else {
                w = width;
                h = baseHeight * w / baseWidth;
            }
            setSize(target, w, h);
        }
        ui.fitSize = fitSize;
    })(ui = app.ui || (app.ui = {}));
})(app || (app = {}));
var app;
(function (app) {
    var format;
    (function (format) {
        function timeMMSS(value) {
            var minutes = Math.floor(value % 60);
            var seconds = value - minutes * 60;
            var result = "";
            if (minutes < 10)
                result += 0;
            result += minutes;
            result += ":";
            if (seconds < 10)
                result += 0;
            result += seconds;
            return result;
        }
        format.timeMMSS = timeMMSS;
    })(format = app.format || (app.format = {}));
})(app || (app = {}));
var app;
(function (app) {
    app.version = new Date().getTime().toString();
    var scene;
    var fpsEl;
    var infoEl;
    var stats = {
        av_time: 0,
        max_time: 0,
    };
    function init() {
        fpsEl = document.getElementById("fps_text");
        infoEl = document.getElementById("info_text");
        app.root = document.getElementById("root");
        document.addEventListener('dragstart', function (e) {
            e.preventDefault();
        });
        adjustSize();
        updateStatus();
        update();
        fl.Bundle.version = app.version;
        fl.Bundle.load("demo", onBundleLoaded);
    }
    app.init = init;
    function onBundleLoaded() {
        scene = new app.HexGame();
        app.root.appendChild(scene.html);
        scene.init();
        resizeScene();
    }
    function resizeScene() {
        scene.resize();
    }
    var _last = Date.now();
    var _time = [];
    function updateStats() {
        var now = Date.now();
        var t = now - _last;
        _last = now;
        _time.push(t);
        if (_time.length < 30)
            return;
        var sum_time = 0;
        var max_time = 0;
        for (var i = 0; i < _time.length; i++) {
            sum_time += _time[i];
            if (_time[i] > max_time)
                max_time = _time[i];
        }
        stats.av_time = sum_time / _time.length;
        stats.max_time = max_time;
        updateStatus();
        _time.length = 0;
    }
    function updateStatus() {
        var av = stats.av_time.toFixed(1);
        var max = stats.max_time.toFixed(1);
        fpsEl.innerText = "av: " + av + "\nmax: " + max;
    }
    function update() {
        requestAnimationFrame(update);
        updateStats();
        adjustSize();
        if (scene)
            scene.update();
    }
    var _rootWidth = -1;
    var _rootHeight = -1;
    function adjustSize() {
        var w = app.root.offsetWidth;
        var h = app.root.offsetHeight;
        if (w != _rootWidth || h != _rootHeight) {
            _rootWidth = w;
            _rootHeight = h;
            if (scene)
                scene.resize();
            var sizeInfo = "[" + _rootWidth + " x " + _rootHeight + "]";
            console.log("resize: " + sizeInfo);
            infoEl.innerText = window.navigator.userAgent + "\n" + sizeInfo;
        }
    }
})(app || (app = {}));
var fl;
(function (fl) {
    var Anchor = (function () {
        function Anchor(source, sourceProperty, target, targetProperty, multiplier) {
            if (multiplier === void 0) { multiplier = 1.0; }
            this._target = target;
            this._targetProperty = targetProperty;
            this._source = source;
            this._sourceProperty = sourceProperty;
            this._multiplier = multiplier;
            this._distance = source[sourceProperty] * multiplier - target[targetProperty];
        }
        Anchor.prototype.apply = function () {
            this._target[this._targetProperty] = this._source[this._sourceProperty] * this._multiplier - this._distance;
        };
        return Anchor;
    }());
    fl.Anchor = Anchor;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Internal = (function () {
        function Internal() {
        }
        Internal.dispatchLabels = function (target) {
            var n = target.labels.length;
            if (n == 0)
                return;
            var frame = target.currentFrame;
            for (var i = 0; i < n; i++) {
                if (target.labels[i].frame == frame) {
                    var label = target.labels[i].name;
                    if (label[0] == "#")
                        target.animation.applyControlLabel(label);
                    if (fl.onFrameLabel)
                        fl.onFrameLabel(target, label);
                }
            }
        };
        Internal.applyColor = function (target) {
            var lc = target.color;
            var parent = target.parent;
            if (parent && parent.isFlashObject) {
                var gc = parent.globalColor;
                var r = lc.r * gc.r;
                var g = lc.g * gc.g;
                var b = lc.b * gc.b;
                var a = lc.a * gc.a;
            }
            else {
                var r = lc.r;
                var g = lc.g;
                var b = lc.b;
                var a = lc.a;
            }
            target.tint = 255 * r << 16 | 255 * g << 8 | 255 * b;
            target.alpha = a;
        };
        Internal.clampRange = function (value, min, max) {
            if (value < min)
                return min;
            else if (value > max)
                return max;
            else
                return value;
        };
        Internal.EMPTY_ARRAY = [];
        return Internal;
    }());
    fl.Internal = Internal;
})(fl || (fl = {}));
var PIXI;
(function (PIXI) {
    PIXI.DisplayObject.prototype.detach = function () {
        if (this.parent)
            this.parent.removeChild(this);
    };
    PIXI.Container.prototype.forEachRecursive = function (action) {
        var n = this.children.length;
        for (var i = 0; i < n; i++) {
            var child = this.children[i];
            if (child.isFlashObject)
                action(child);
            child.forEachRecursive(action);
        }
    };
    PIXI.Container.prototype.forEachFrameObject = function (action) {
        var n = this.children.length;
        for (var i = 0; i < n; i++) {
            var child = this.children[i];
            if (child.isFrameObject)
                action(child);
        }
    };
    PIXI.Container.prototype.findAll = function (predicate) {
        var result = [];
        var n = this.children.length;
        for (var i = 0; i < n; i++) {
            var child = this.children[i];
            if (predicate(child))
                result.push(child);
        }
        return result;
    };
    PIXI.Container.prototype.findAllByPrefix = function (prefix) {
        return this.findAll(function (it) { return (it.name || "").indexOf(prefix) == 0; });
    };
    PIXI.Container.prototype.findByPath = function (path) {
        var parts = path.split('/');
        var target = this;
        for (var i = 0; i < parts.length; i++) {
            var child = target.getChildByName(parts[i]);
            if (!child)
                return null;
            if (i + 1 == parts.length)
                return child;
            if (!(child instanceof PIXI.Container))
                return null;
            target = child;
        }
        return null;
    };
    PIXI.Container.prototype.findByResource = function (prefix) {
        var result = [];
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (!child.isFrameObject)
                continue;
            var obj = child;
            if (obj.resource.name.indexOf(prefix) == 0)
                result.push(obj);
        }
        return result;
    };
    PIXI.Container.prototype.playAllChildren = function () {
        this.children.forEach(function (it) {
            var animable = it;
            if (animable.totalFrames > 1)
                animable.animation.play();
        });
    };
    PIXI.Container.prototype.stopAllChildren = function () {
        this.children.forEach(function (it) {
            var animable = it;
            if (animable.totalFrames > 1)
                animable.animation.stop();
        });
    };
})(PIXI || (PIXI = {}));
var fl;
(function (fl) {
    var Color = (function () {
        function Color(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        Color.fromNum = function (value) {
            var r = (value & 0xFF0000) >> 16;
            var g = (value & 0x00FF00) >> 8;
            var b = (value & 0x0000FF);
            return new Color(r / 255.0, g / 255.0, b / 255.0, 1);
        };
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b, this.a);
        };
        Color.prototype.setTo = function (value) {
            value.r = this.r;
            value.g = this.g;
            value.b = this.b;
            value.a = this.a;
        };
        Color.prototype.setFrom = function (value) {
            this.r = value.r;
            this.g = value.g;
            this.b = value.b;
            this.a = value.a;
        };
        return Color;
    }());
    fl.Color = Color;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var FlashObject = (function (_super) {
        __extends(FlashObject, _super);
        function FlashObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FlashObject;
    }(PIXI.Container));
    fl.FlashObject = FlashObject;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var FrameLabel = (function () {
        function FrameLabel() {
        }
        return FrameLabel;
    }());
    fl.FrameLabel = FrameLabel;
    var FrameObject = (function (_super) {
        __extends(FrameObject, _super);
        function FrameObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FrameObject.prototype.gotoLabel = function (label) {
            var n = this.labels.length;
            for (var i = 0; i < n; i++) {
                if (this.labels[i].name == label) {
                    this.currentFrame = this.labels[i].frame;
                    return true;
                }
            }
            return false;
        };
        FrameObject.prototype.stepForward = function () {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;
            else
                this.currentFrame = 0;
            return this;
        };
        FrameObject.prototype.stepBackward = function () {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;
            else
                this.currentFrame = this.totalFrames - 1;
            return this;
        };
        FrameObject.prototype.gotoNextFrame = function () {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;
            return this;
        };
        FrameObject.prototype.gotoPrevFrame = function () {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;
            return this;
        };
        FrameObject.prototype.gotoFirstFrame = function () {
            this.currentFrame = 0;
            return this;
        };
        FrameObject.prototype.gotoLastFrame = function () {
            this.currentFrame = this.totalFrames - 1;
            return this;
        };
        FrameObject.prototype.gotoRandomFrame = function () {
            this.currentFrame = (Math.random() * this.totalFrames) | 0;
            return this;
        };
        FrameObject.prototype.isFirstFrame = function () {
            return this.currentFrame == 0;
        };
        FrameObject.prototype.isLastFrame = function () {
            return this.currentFrame == this.totalFrames - 1;
        };
        return FrameObject;
    }(fl.FlashObject));
    fl.FrameObject = FrameObject;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Resource = (function () {
        function Resource(id) {
            this._id = id;
        }
        Resource.prototype.createInstance = function () {
            throw new Error("Not implemented");
        };
        Resource.prototype.dispose = function () {
            throw new Error("Not implemented");
        };
        Object.defineProperty(Resource.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Resource.prototype, "name", {
            get: function () {
                var id = this._id;
                return id.substr(id.lastIndexOf("/") + 1);
            },
            enumerable: true,
            configurable: true
        });
        return Resource;
    }());
    fl.Resource = Resource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var PlaceholderResource = (function (_super) {
        __extends(PlaceholderResource, _super);
        function PlaceholderResource(id) {
            return _super.call(this, id) || this;
        }
        PlaceholderResource.prototype.createInstance = function () {
            return new fl.Placeholder();
        };
        PlaceholderResource.prototype.dispose = function () {
        };
        return PlaceholderResource;
    }(fl.Resource));
    fl.PlaceholderResource = PlaceholderResource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var SpriteFrame = (function () {
        function SpriteFrame() {
        }
        return SpriteFrame;
    }());
    fl.SpriteFrame = SpriteFrame;
    var SpriteResource = (function (_super) {
        __extends(SpriteResource, _super);
        function SpriteResource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpriteResource.fromJson = function (data, texture) {
            var id = data.path;
            var res = new SpriteResource(id);
            res.texture = texture;
            res.scale = data.scale;
            res.labels = data.labels;
            res.frames = [];
            for (var i = 0; i < data.frames.length; i++) {
                var props = data.frames[i];
                var bounds = new PIXI.Rectangle(props[0], props[1], props[2], props[3]);
                var anchor = (bounds.width > 0 && bounds.height > 0)
                    ? new PIXI.Point(props[4] / bounds.width, props[5] / bounds.height)
                    : new PIXI.Point();
                var frame = {
                    texture: new PIXI.Texture(texture.baseTexture, bounds),
                    anchor: anchor,
                    labels: props[6],
                };
                res.frames.push(frame);
            }
            return res;
        };
        SpriteResource.prototype.createInstance = function () {
            return new fl.Sprite(this);
        };
        SpriteResource.prototype.dispose = function () {
            this.texture.destroy(false);
            delete this.texture;
            delete this.frames;
            delete this.labels;
        };
        return SpriteResource;
    }(fl.Resource));
    fl.SpriteResource = SpriteResource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var ClipResource = (function (_super) {
        __extends(ClipResource, _super);
        function ClipResource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClipResource.fromJson = function (data) {
            var id = data.path;
            var r = new ClipResource(id);
            r.resources = data.resources;
            r.instances = ClipResource.readInstances(data.instances);
            r.frames = ClipResource.readFrames(data.frames, r.instances.length);
            r.labels = data.labels;
            return r;
        };
        ClipResource.readInstances = function (data) {
            var instances = [];
            for (var i = 0; i < data.length; i++) {
                var props = data[i];
                var inst = new ChildInfo();
                inst.resIndex = props[0];
                inst.name = props[1];
                instances[i] = inst;
            }
            return instances;
        };
        ClipResource.readFrames = function (data, totalInstCount) {
            var framesCount = data.length;
            var frames = [];
            for (var i = 0; i < framesCount; i++) {
                frames[i] = ClipResource.readFrame(data[i], totalInstCount);
            }
            return frames;
        };
        ClipResource.readFrame = function (data, totalInstCount) {
            var frame = new FrameData();
            frame.existingInstancesBits = [];
            for (var i = 0; i < totalInstCount; i++) {
                frame.existingInstancesBits[i] = false;
            }
            var instCount = data.length;
            frame.instances = [];
            for (var i = 0; i < instCount; i++) {
                var instance = ClipResource.readInstance(data[i]);
                frame.instances[i] = instance;
                frame.existingInstancesBits[instance.id] = true;
            }
            return frame;
        };
        ClipResource.readInstance = function (data) {
            var props = new ChildProps();
            props.id = data[0];
            props.position = new PIXI.Point(data[1], data[2]);
            props.rotation = data[3];
            props.scale = new PIXI.Point(data[4], data[5]);
            props.color = new fl.Color(data[6], data[7], data[8], data[9]);
            var matrixData = data[10];
            if (matrixData) {
                props.matrix = new PIXI.Matrix();
                props.matrix.a = matrixData[0];
                props.matrix.b = matrixData[1];
                props.matrix.c = matrixData[2];
                props.matrix.d = matrixData[3];
                props.matrix.tx = matrixData[4];
                props.matrix.ty = matrixData[5];
            }
            return props;
        };
        ClipResource.prototype.createInstance = function () {
            return new fl.Clip(this);
        };
        ClipResource.prototype.getChildResource = function (childIndex) {
            var resIndex = this.instances[childIndex].resIndex;
            return this.resources[resIndex];
        };
        ClipResource.prototype.dispose = function () {
            delete this.resources;
            delete this.instances;
            delete this.frames;
            delete this.labels;
        };
        return ClipResource;
    }(fl.Resource));
    fl.ClipResource = ClipResource;
    var FrameData = (function () {
        function FrameData() {
        }
        FrameData.prototype.containsIndex = function (id) {
            return id >= 0
                && id < this.existingInstancesBits.length
                && this.existingInstancesBits[id];
        };
        FrameData.EMPTY_LABELS = [];
        return FrameData;
    }());
    var ChildInfo = (function () {
        function ChildInfo() {
        }
        return ChildInfo;
    }());
    var ChildProps = (function () {
        function ChildProps() {
            this.matrixChecked = false;
        }
        ChildProps.prototype.applyTo = function (target) {
            var x = this.position.x;
            var y = this.position.y;
            var text = target;
            if (text.isTextField) {
                x += text._xCorrection;
                y += text._yCorrection;
            }
            target.position.x = x;
            target.position.y = y;
            target.rotation = this.rotation;
            target.scaleX = this.scale.x;
            target.scaleY = this.scale.y;
            target.color.r = this.color.r;
            target.color.g = this.color.g;
            target.color.b = this.color.b;
            target.color.a = this.color.a;
            if (!this.matrixChecked) {
                if (this.matrix && target.scaleMultiplier > 0 && target.scaleMultiplier != 1)
                    this.matrix = null;
                this.matrixChecked = true;
            }
            target.matrix = this.matrix;
        };
        return ChildProps;
    }());
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Bundle = (function () {
        function Bundle(name) {
            this.textures = {};
            this.resources = {};
            this.name = name;
        }
        Bundle.createPlaceholders = function () {
            var bundle = new Bundle("placeholders");
            bundle.resources["placeholders/empty"] = new fl.PlaceholderResource("placeholders/empty");
            return bundle;
        };
        Bundle.loadAll = function (bundleNames, onComplete) {
            var i = 0;
            var loadNext = function () {
                if (i < bundleNames.length) {
                    Bundle.load(bundleNames[i], loadNext);
                    i++;
                }
                else {
                    onComplete();
                }
            };
            loadNext();
        };
        Bundle.load = function (bundleName, onComplete) {
            console.log("Bundle.load: " + bundleName);
            var bundle = Bundle._bundles[bundleName];
            if (bundle)
                throw new Error("Bundle is already loaded: " + bundleName);
            bundle = new Bundle(bundleName);
            Bundle._bundles[bundleName] = bundle;
            bundle.load(onComplete);
        };
        Bundle.unload = function (bundleName) {
            console.log("Bundle.unload: " + bundleName);
            var bundle = Bundle._bundles[bundleName];
            if (!bundle)
                throw new Error("Bundle is not loaded: " + bundleName);
            delete Bundle._bundles[bundleName];
            bundle.unload();
        };
        Bundle.getResource = function (resourceId) {
            var bundleId = resourceId.substr(0, resourceId.indexOf('/'));
            var bundle = Bundle._bundles[bundleId];
            if (!bundle)
                throw new Error('Bundle is not loaded: ' + resourceId);
            var res = bundle.resources[resourceId];
            if (res == null)
                throw new Error('Resource not found: ' + resourceId);
            return res;
        };
        Bundle.createFlashObject = function (id) {
            var res = Bundle.getResource(id);
            if (res instanceof fl.SpriteResource)
                return new fl.Sprite(res);
            else if (res instanceof fl.ClipResource)
                return new fl.Clip(res);
            else
                throw new Error('Unknown resource type: ' + id);
        };
        Bundle.createSprite = function (id) {
            var res = Bundle.getResource(id);
            if (!(res instanceof fl.SpriteResource))
                throw new Error('Resource is not a Sprite: ' + id);
            return new fl.Sprite(res);
        };
        Bundle.createClip = function (id) {
            var res = Bundle.getResource(id);
            if (!(res instanceof fl.ClipResource))
                throw new Error('Resource is not a Clip: ' + id);
            return new fl.Clip(res);
        };
        Bundle.prototype.load = function (onComplete) {
            this.completeHandler = onComplete;
            this.loadResources();
        };
        Bundle.prototype.unload = function () {
            var _this = this;
            Object.keys(this.resources)
                .forEach(function (key) { return _this.resources[key].dispose(); });
            Object.keys(this.textures)
                .forEach(function (key) { return _this.textures[key].destroy(true); });
            this.resources = {};
            this.textures = {};
        };
        Bundle.prototype.loadResources = function () {
            var _this = this;
            var url = this.getUrl('bundle.json');
            this.verboseLog('loading: ' + url);
            var loader = new PIXI.loaders.Loader();
            loader.add('json', url);
            loader.load(function (it, resources) {
                _this.verboseLog('OK: ' + url);
                _this.rawData = resources['json'].data;
                if (_this.rawData)
                    _this.loadTextures();
            });
        };
        Bundle.prototype.loadTextures = function () {
            var _this = this;
            this.textures = {};
            var names = this.rawData["textures"];
            if (names.length > 0) {
                var loader = new PIXI.loaders.Loader;
                var _loop_1 = function (textureName) {
                    url = this_1.getUrl(textureName + Bundle.textureExt);
                    this_1.verboseLog('loading: ' + url);
                    loader.add(textureName, url, null, function () {
                        _this.textures[textureName] = loader.resources[textureName].texture;
                        _this.verboseLog("OK: " + textureName);
                    });
                };
                var this_1 = this, url;
                for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                    var textureName = names_1[_i];
                    _loop_1(textureName);
                }
                loader.load(function () {
                    _this.createResources();
                    _this.complete();
                });
            }
            else {
                this.createResources();
                this.complete();
            }
        };
        Bundle.prototype.complete = function () {
            this.rawData = null;
            if (this.completeHandler != null)
                this.completeHandler();
        };
        Bundle.prototype.createResources = function () {
            var symbols = this.rawData['symbols'];
            for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
                var symbol = symbols_1[_i];
                var id = symbol.path;
                this.resources[id] = this.createResource(symbol);
            }
        };
        Bundle.prototype.createResource = function (json) {
            var type = json.type;
            if (type == "sprite") {
                var textureName = json.texture;
                var texture = this.textures[textureName];
                if (!texture)
                    throw new Error("Unknown texture: " + textureName);
                return fl.SpriteResource.fromJson(json, texture);
            }
            if (type == "clip")
                return fl.ClipResource.fromJson(json);
            throw new Error("Unknown resource type: " + type);
        };
        Bundle.prototype.verboseLog = function (message) {
            if (Bundle.verboseLog)
                console.log("| " + message);
        };
        Bundle.prototype.getUrl = function (assetName) {
            return Bundle.rootPath + "/" + this.name + "/" + assetName + "?v=" + Bundle.version;
        };
        Bundle.version = "0";
        Bundle.rootPath = "assets";
        Bundle.textureExt = ".png";
        Bundle.verboseLog = true;
        Bundle._bundles = {
            "placeholders": Bundle.createPlaceholders()
        };
        return Bundle;
    }());
    fl.Bundle = Bundle;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Container = (function (_super) {
        __extends(Container, _super);
        function Container() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.timelineIndex = -1;
            _this.labels = fl.Internal.EMPTY_ARRAY;
            _this.color = new fl.Color(1, 1, 1, 1);
            _this.isFlashObject = true;
            _this.isFrameObject = false;
            _this.scaleMultiplier = 1;
            _this.globalColor = {};
            return _this;
        }
        Object.defineProperty(Container.prototype, "scaleX", {
            get: function () { return this.scale.x * this.scaleMultiplier; },
            set: function (value) { this.scale.x = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "scaleY", {
            get: function () { return this.scale.y * this.scaleMultiplier; },
            set: function (value) { this.scale.y = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "scaleXY", {
            get: function () { return 0.5 * (this.scaleX + this.scaleY); },
            set: function (value) {
                this.scaleX = value;
                this.scaleY = value;
            },
            enumerable: true,
            configurable: true
        });
        Container.prototype.handleFrameChange = function () {
        };
        Container.prototype.updateTransform = function () {
            if (!this.visible)
                return;
            var animable = this;
            if (animable.isFlashObject && animable.animation && animable.animation.isActive)
                animable.animation.update();
            this.updateColor();
            if (this.matrix) {
                var pt = this.parent.worldTransform;
                var wt = this.worldTransform;
                var m = this.matrix;
                wt.a = m.a * pt.a + m.b * pt.c;
                wt.b = m.a * pt.b + m.b * pt.d;
                wt.c = m.c * pt.a + m.d * pt.c;
                wt.d = m.c * pt.b + m.d * pt.d;
                wt.tx = m.tx * pt.a + m.ty * pt.c + pt.tx;
                wt.ty = m.tx * pt.b + m.ty * pt.d + pt.ty;
                for (var i = 0, j = this.children.length; i < j; ++i) {
                    this.children[i].updateTransform();
                }
                this.worldAlpha = this.alpha * this.parent.worldAlpha;
            }
            else {
                _super.prototype.updateTransform.call(this);
            }
        };
        Container.prototype.updateColor = function () {
            var lc = this.color;
            var gc = this.globalColor;
            var parentObject = this.parent;
            if (parentObject && parentObject.isFlashObject) {
                var pc = parentObject.globalColor;
                gc.r = lc.r * pc.r;
                gc.g = lc.g * pc.g;
                gc.b = lc.b * pc.b;
                gc.a = lc.a * pc.a;
            }
            else {
                gc.r = lc.r;
                gc.g = lc.g;
                gc.b = lc.b;
                gc.a = lc.a;
            }
        };
        return Container;
    }(PIXI.Container));
    fl.Container = Container;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Placeholder = (function (_super) {
        __extends(Placeholder, _super);
        function Placeholder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Placeholder.prototype.getLocalBounds = function () {
            return Placeholder.predefinedBounds;
        };
        Placeholder.predefinedBounds = new PIXI.Rectangle(0, 0, 100, 100);
        return Placeholder;
    }(fl.Container));
    fl.Placeholder = Placeholder;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(resource) {
            var _this = _super.call(this) || this;
            _this.timelineIndex = -1;
            _this.color = new fl.Color(1, 1, 1, 1);
            _this.isFlashObject = true;
            _this.isFrameObject = true;
            _this.scaleMultiplier = 1;
            _this._currentFrame = 0;
            _this._totalFrames = 1;
            _this.labels = fl.Internal.EMPTY_ARRAY;
            _this.setResourceInternal(resource);
            _this.scaleMultiplier = resource.scale;
            _this.scaleXY = 1;
            return _this;
        }
        Object.defineProperty(Sprite.prototype, "scaleX", {
            get: function () { return this.scale.x * this.scaleMultiplier; },
            set: function (value) { this.scale.x = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "scaleY", {
            get: function () { return this.scale.y * this.scaleMultiplier; },
            set: function (value) { this.scale.y = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "scaleXY", {
            get: function () { return 0.5 * (this.scaleX + this.scaleY); },
            set: function (value) { this.scaleX = value; this.scaleY = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "totalFrames", {
            get: function () { return this._totalFrames; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "currentFrame", {
            get: function () { return this._currentFrame; },
            set: function (value) {
                if (this._currentFrame != value) {
                    this._currentFrame = fl.Internal.clampRange(value, 0, this._totalFrames - 1);
                    this.handleFrameChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "animation", {
            get: function () {
                return this._animation
                    || (this._animation = new fl.Animation(this));
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.updateTransform = function () {
            if (this._animation && this._animation.isActive)
                this.animation.update();
            fl.Internal.applyColor(this);
            if (this.matrix) {
                var pt = this.parent.worldTransform;
                var wt = this.worldTransform;
                var m = this.matrix;
                wt.a = m.a * pt.a + m.b * pt.c;
                wt.b = m.a * pt.b + m.b * pt.d;
                wt.c = m.c * pt.a + m.d * pt.c;
                wt.d = m.c * pt.b + m.d * pt.d;
                wt.tx = m.tx * pt.a + m.ty * pt.c + pt.tx;
                wt.ty = m.tx * pt.b + m.ty * pt.d + pt.ty;
                this.worldAlpha = this.alpha * this.parent.worldAlpha;
            }
            else {
                _super.prototype.updateTransform.call(this);
            }
        };
        Sprite.prototype.handleFrameChange = function () {
            var frame = this._resource.frames[this._currentFrame];
            this.anchor.set(frame.anchor.x, frame.anchor.y);
            this.texture = frame.texture;
            fl.Internal.dispatchLabels(this);
        };
        Object.defineProperty(Sprite.prototype, "resource", {
            get: function () {
                return this._resource;
            },
            set: function (value) {
                this.setResourceInternal(value);
                this.currentFrame = 0;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.setResourceInternal = function (value) {
            this._resource = value;
            this._totalFrames = value.frames.length;
            this._currentFrame = 0;
            this.labels = value.labels;
            this.handleFrameChange();
        };
        Sprite.prototype.toString = function () {
            return 'Sprite[' + this._resource.id + ']';
        };
        return Sprite;
    }(PIXI.Sprite));
    fl.Sprite = Sprite;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Clip = (function (_super) {
        __extends(Clip, _super);
        function Clip(resource) {
            var _this = _super.call(this) || this;
            _this.isFrameObject = true;
            _this._currentFrame = 0;
            _this._totalFrames = 1;
            _this.autoPlayChildren = true;
            _this._instances = [];
            _this._resource = resource;
            _this._totalFrames = resource.frames.length;
            _this.labels = resource.labels;
            _this.constructChildren();
            _this.handleFrameChange();
            return _this;
        }
        Object.defineProperty(Clip.prototype, "totalFrames", {
            get: function () { return this._totalFrames; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Clip.prototype, "currentFrame", {
            get: function () { return this._currentFrame; },
            set: function (value) {
                if (this._currentFrame != value) {
                    this._currentFrame = fl.Internal.clampRange(value, 0, this._totalFrames - 1);
                    this.handleFrameChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Clip.prototype, "animation", {
            get: function () {
                return this._animation
                    || (this._animation = new fl.Animation(this));
            },
            enumerable: true,
            configurable: true
        });
        Clip.prototype.constructChildren = function () {
            var count = this._resource.instances.length;
            for (var i = 0; i < count; i++) {
                var childName = this._resource.instances[i].name;
                var resource = this._resource.getChildResource(i);
                var child;
                if (typeof resource == "string") {
                    child = fl.Bundle
                        .getResource(resource)
                        .createInstance();
                }
                else if (resource.hasOwnProperty("text")) {
                    child = fl.Text.fromData(resource["text"]);
                }
                else {
                    throw new Error("cannot instantiate: invalid resource");
                }
                child.name = childName;
                this._instances[i] = child;
            }
        };
        Clip.prototype.handleFrameChange = function () {
            this.updateChildren();
            fl.Internal.dispatchLabels(this);
        };
        Clip.prototype.updateChildren = function () {
            var frame = this._resource.frames[this._currentFrame];
            var childIndex = 0;
            var propsIndex = 0;
            var propsCount = frame.instances.length;
            while (childIndex < this.children.length && propsIndex < propsCount) {
                var child = this.children[childIndex];
                if (!child.isFlashObject) {
                    childIndex++;
                    continue;
                }
                var childProps = frame.instances[propsIndex];
                if (child.timelineIndex == childProps.id) {
                    childProps.applyTo(child);
                    if (this.autoPlayChildren
                        && child.isFrameObject
                        && child.totalFrames > 1) {
                        child.animation.updateByParent();
                    }
                    propsIndex++;
                    childIndex++;
                }
                else if (frame.containsIndex(child.timelineIndex)) {
                    var newItem = this.getTimeLineItem(childProps.id);
                    childProps.applyTo(newItem);
                    this.addChildAt(newItem, this.getChildIndex(child));
                    propsIndex++;
                    childIndex++;
                }
                else {
                    if (child.timelineIndex >= 0)
                        this.removeChildAt(childIndex);
                    else
                        childIndex++;
                }
            }
            while (propsIndex < propsCount) {
                var childProps = frame.instances[propsIndex];
                var newItem = this.getTimeLineItem(childProps.id);
                childProps.applyTo(newItem);
                this.addChild(newItem);
                propsIndex++;
                childIndex++;
            }
            while (childIndex < this.children.length) {
                var item = this.children[childIndex];
                if (!item.isFlashObject) {
                    childIndex++;
                    continue;
                }
                if (item.timelineIndex >= 0)
                    this.removeChildAt(childIndex);
                else
                    childIndex++;
            }
        };
        Clip.prototype.getTimeLineItem = function (instanceId) {
            var instance = this._instances[instanceId];
            instance.timelineIndex = instanceId;
            if (instance.isFrameObject) {
                var frameObj = instance;
                frameObj.currentFrame = 0;
            }
            return instance;
        };
        Object.defineProperty(Clip.prototype, "resource", {
            get: function () {
                return this._resource;
            },
            enumerable: true,
            configurable: true
        });
        Clip.prototype.toString = function () {
            return 'Clip[' + this._resource.id + ']';
        };
        Clip.prototype.tryGetElement = function (name) {
            var n = this._instances.length;
            for (var i = 0; i < n; i++) {
                var inst = this._instances[i];
                if (inst.name == name)
                    return inst;
            }
            return null;
        };
        Clip.prototype.getElement = function (name) {
            var element = this.tryGetElement(name);
            if (element)
                return element;
            else
                throw new Error("Instance not found: " + name);
        };
        Object.defineProperty(Clip.prototype, "instances", {
            get: function () {
                return this._instances;
            },
            enumerable: true,
            configurable: true
        });
        return Clip;
    }(fl.Container));
    fl.Clip = Clip;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Button = (function () {
        function Button(target, action) {
            var _this = this;
            this._enabled = true;
            fl.assertPresent(target, "targetCell");
            this.content = target;
            if (action)
                this.onRelease = action;
            this.content.on("mousedown", function (e) {
                _this.setDownState();
                if (_this.onPress)
                    _this.onPress(_this, e);
            });
            this.content.on("mouseup", function (e) {
                _this.setUpState();
                if (_this.onRelease)
                    _this.onRelease(_this, e);
            });
            this.content.on("mouseupoutside", function () {
                _this.setUpState();
            });
            this.content.on("touchstart", function (e) {
                _this.setDownState();
                if (_this.onPress)
                    _this.onPress(_this, e);
            });
            this.content.on("touchend", function (e) {
                _this.setUpState();
                if (_this.onRelease)
                    _this.onRelease(_this, e);
            });
            this.content.on("touchendoutside", function () {
                _this.setUpState();
            });
            this.refreshEnabledState();
        }
        Object.defineProperty(Button.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (value) {
                if (this._enabled != value) {
                    this._enabled = value;
                    this.refreshEnabledState();
                }
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.refreshEnabledState = function () {
            this.content.interactive = this._enabled;
            this.content.buttonMode = this._enabled;
        };
        Button.prototype.setDownState = function () {
            var states = this.content;
            if (states.isFlashObject) {
                states.currentFrame = 1;
                states.updateTransform();
            }
        };
        Button.prototype.setUpState = function () {
            var states = this.content;
            if (states.isFlashObject) {
                states.currentFrame = 0;
                states.updateTransform();
            }
        };
        return Button;
    }());
    fl.Button = Button;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(text, style) {
            var _this = _super.call(this, text, style) || this;
            _this.timelineIndex = -1;
            _this.color = new fl.Color(1, 1, 1, 1);
            _this.isFlashObject = true;
            _this.isFrameObject = false;
            _this.scaleMultiplier = 1;
            _this.isTextField = true;
            _this._xCorrection = 0;
            _this._yCorrection = 0;
            return _this;
        }
        Text.fromData = function (data) {
            var text = data.text || "";
            var style = {};
            style.fontFamily = data.fontName;
            style.fontSize = data.fontSize + "px";
            style.fontStyle = (data.bold ? "bold " : "") + (data.italic ? "italic " : "");
            style.fill = data.color;
            style.align = data.align;
            style.padding = 20;
            style.wordWrap = data.multiline;
            style.wordWrapWidth = data.textWidth;
            style.lineHeight = Math.floor(data.fontSize * 1.15) + data.lineSpacing;
            if (data.shadowColor) {
                style.dropShadow = true;
                style.dropShadowColor = data.shadowColor;
                style.dropShadowAngle = data.shadowAngle;
                style.dropShadowDistance = data.shadowDistance;
            }
            if (data.strokeColor) {
                style.stroke = data.strokeColor;
                style.strokeThickness = data.strokeThickness;
                style.lineHeight -= Math.max(1, Math.floor(0.25 * data.strokeThickness));
                style.lineJoin = "round";
            }
            var field = new fl.Text(text, new PIXI.TextStyle(style));
            if (data.align == "center") {
                field.anchor.x = 0.5;
                field._xCorrection = 0.5 * data.fieldSize[0];
                field._yCorrection = 1;
            }
            else if (data.align == "right") {
                field.anchor.x = 1;
                field._xCorrection = data.fieldSize[0];
                field._yCorrection = 1;
            }
            else {
                field._xCorrection = 1;
                field._yCorrection = 1;
            }
            return field;
        };
        Object.defineProperty(Text.prototype, "scaleX", {
            get: function () { return this.scale.x * this.scaleMultiplier; },
            set: function (value) { this.scale.x = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "scaleY", {
            get: function () { return this.scale.y * this.scaleMultiplier; },
            set: function (value) { this.scale.y = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "scaleXY", {
            get: function () { return 0.5 * (this.scaleX + this.scaleY); },
            set: function (value) {
                this.scaleX = value;
                this.scaleY = value;
            },
            enumerable: true,
            configurable: true
        });
        Text.prototype.updateTransform = function () {
            fl.Internal.applyColor(this);
            _super.prototype.updateTransform.call(this);
        };
        return Text;
    }(PIXI.Text));
    fl.Text = Text;
})(fl || (fl = {}));
var fl;
(function (fl) {
    applyMixins(fl.Container, fl.FlashObject);
    applyMixins(fl.Clip, fl.FrameObject);
    applyMixins(fl.Sprite, fl.FlashObject);
    applyMixins(fl.Sprite, fl.FrameObject);
    function applyMixins(derived, base) {
        Object.getOwnPropertyNames(base.prototype).forEach(function (name) {
            derived.prototype[name] = base.prototype[name];
        });
    }
    fl.applyMixins = applyMixins;
    function assertPresent(value, name) {
        if (!value)
            throw new Error("Value not present: " + name);
    }
    fl.assertPresent = assertPresent;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Animation = (function () {
        function Animation(target) {
            this.ticksPerFrame = Animation.defaultTicksPerFrame;
            this.isActive = false;
            this._innerActive = true;
            this._innerJump = undefined;
            this._innerCond = undefined;
            this._target = target;
        }
        Animation.sendSignal = function (signal) {
            Animation.signals[signal] = 1;
        };
        Animation.prototype.parseCondition = function (raw) {
            if (this._innerCond === undefined) {
                this._innerCond = Number(raw);
                if (isNaN(this._innerCond)) {
                    this._innerCond = raw;
                    delete Animation.signals[this._innerCond];
                }
            }
        };
        Animation.prototype.parseJump = function (raw) {
            this._innerJump = Number(raw) - 1;
            if (isNaN(this._innerJump))
                this._innerJump = raw;
        };
        Animation.prototype.applyControlLabel = function (label) {
            if (label === "#stop") {
                this._innerActive = false;
                this.isActive = false;
            }
            else if (label.indexOf("#loop") == 0) {
                var params = label.split("_");
                this.parseJump(params[1]);
                this.parseCondition(params[2]);
            }
            else if (label.indexOf("#wait") == 0) {
                var params = label.split("_");
                this._innerJump = this._target.currentFrame;
                this.parseCondition(params[1]);
            }
            else if (label.indexOf("#send") == 0) {
                var signal = label.split("_")[1];
                Animation.sendSignal(signal);
            }
        };
        Animation.prototype.updateByParent = function () {
            if (!this._innerActive)
                return;
            if (this._innerJump === undefined) {
                this._target.stepForward();
                return;
            }
            var isLoopExit = (this._innerCond == 0)
                || Animation.signals[this._innerCond] == 1;
            if (isLoopExit) {
                this._innerCond = undefined;
                this._innerJump = undefined;
                this._target.stepForward();
                return;
            }
            var isWaiting = this._innerJump === this._target.currentFrame;
            if (!isWaiting) {
                if (typeof (this._innerJump) == "string")
                    this._target.gotoLabel(this._innerJump);
                else
                    this._target.currentFrame = this._innerJump;
                this._innerJump = undefined;
            }
            var innerCond = this._innerCond;
            if (typeof (innerCond) == "number" && innerCond > 0)
                this._innerCond = innerCond - 1;
        };
        Animation.prototype.update = function () {
            if (++this._tickCounter < this.ticksPerFrame)
                return;
            this._tickCounter = 0;
            if (this._innerJump !== undefined) {
                this.updateByParent();
            }
            else {
                var currentFrame = this._target.currentFrame;
                if (!this._looping && currentFrame == this._endFrame) {
                    this.stop();
                    if (this._completeHandler)
                        this._completeHandler(this);
                    return;
                }
                var nextFrame = currentFrame + this._step;
                if (nextFrame < 0)
                    nextFrame = this._target.totalFrames - 1;
                else if (nextFrame >= this._target.totalFrames)
                    nextFrame = 0;
                this._target.currentFrame = nextFrame;
            }
        };
        Animation.prototype.playTo = function (endFrame) {
            this._looping = false;
            this._endFrame = fl.Internal.clampRange(endFrame, 0, this._target.totalFrames - 1);
            this._step = this._endFrame > this._target.currentFrame ? 1 : -1;
            this._innerCond = undefined;
            this._innerJump = undefined;
            this.isActive = true;
        };
        Animation.prototype.playLoop = function (step) {
            this._looping = true;
            this._step = step;
            this._innerCond = undefined;
            this._innerJump = undefined;
            this.isActive = true;
        };
        Animation.prototype.stop = function () {
            this._innerCond = undefined;
            this._innerJump = undefined;
            this.isActive = false;
        };
        Animation.prototype.play = function () {
            this.playLoop(1);
        };
        Animation.prototype.playReverse = function () {
            this.playLoop(-1);
        };
        Animation.prototype.playToBegin = function () {
            this.playTo(0);
        };
        Animation.prototype.playToEnd = function () {
            this.playTo(this._target.totalFrames - 1);
        };
        Animation.prototype.playFromBeginToEnd = function () {
            this._target.currentFrame = 0;
            this.playToEnd();
        };
        Animation.prototype.playFromEndToBegin = function () {
            this._target.currentFrame = this._target.totalFrames - 1;
            this.playToBegin();
        };
        Animation.prototype.gotoAndStop = function (frameNum) {
            this._target.currentFrame = frameNum;
            this.stop();
        };
        Animation.prototype.gotoAndPlay = function (frameNum) {
            this._target.currentFrame = frameNum;
            this.play();
        };
        Animation.prototype.onComplete = function (handler) {
            this._completeHandler = handler;
            return this;
        };
        Animation.defaultTicksPerFrame = 1;
        Animation.signals = {};
        return Animation;
    }());
    fl.Animation = Animation;
})(fl || (fl = {}));
var app;
(function (app) {
    var ROWS = 10;
    var COLS = 12;
    var CELL_W = 64;
    var CELL_H = 55.45;
    var CELL_X = 10;
    var CELL_Y = 12;
    var GAME_W = 1280;
    var GAME_H = 720;
    var CANVAS_W = 820;
    var CANVAS_H = 600;
    function getX(i, j) {
        if (i % 2)
            return CELL_X + CELL_W * (j + 0.5);
        else
            return CELL_X + CELL_W * j;
    }
    function getY(i) {
        return CELL_Y + CELL_H * i;
    }
    var Player = (function () {
        function Player() {
            this.currentTurn = 0;
            this.count = 0;
            this.points = 0;
            this.time = 0;
        }
        return Player;
    }());
    app.Player = Player;
    var HexGame = (function () {
        function HexGame() {
            this.left = new app.SideView();
            this.right = new app.SideView();
            this.center = jsx("div", { class: "game-center" });
            this.html = jsx("div", { class: "game" },
                this.left.html,
                this.center,
                this.right.html);
            this.playerA = new Player();
            this.playerB = new Player();
            this.pixi = new PIXI.Application(CANVAS_W, CANVAS_H, {
                transparent: false,
                autoResize: false,
                autoStart: false,
                clearBeforeRender: true,
                backgroundColor: 0xf2f5d5,
                forceCanvas: true,
            });
        }
        HexGame.prototype.init = function () {
            this.left.turnImage.src = "assets/demo/turn_a.png";
            this.right.turnImage.src = "assets/demo/turn_b.png";
            this.center.appendChild(this.pixi.view);
            for (var i = 0; i < ROWS; i++) {
                for (var j = 0; j < COLS; j++) {
                    var cell = fl.Bundle.createSprite("demo/cell_0");
                    cell.x = getX(i, j);
                    cell.y = getY(i);
                    this.pixi.stage.addChild(cell);
                }
            }
            this.refresh();
        };
        HexGame.prototype.refresh = function () {
            this.left.refresh(this.playerA);
            this.right.refresh(this.playerB);
        };
        HexGame.prototype.update = function () {
            this.pixi.render();
        };
        HexGame.prototype.resize = function () {
            app.ui.fitSize(this.html, app.root.offsetWidth, app.root.offsetHeight, GAME_W, GAME_H);
            var canvas = this.pixi.view;
            app.ui.fitSize(canvas, this.center.offsetWidth, app.root.offsetHeight, CANVAS_W, CANVAS_H);
            var canvasWidth = canvas.offsetWidth;
            var canvasHeight = canvas.offsetHeight;
            var dpi = window.devicePixelRatio;
            var renderWidth = Math.floor(canvasWidth * dpi);
            var renderHeight = Math.floor(canvasHeight * dpi);
            this.pixi.renderer.resize(renderWidth, renderHeight);
            var scale = renderWidth / CANVAS_W;
            this.pixi.stage.scale.x = scale;
            this.pixi.stage.scale.y = scale;
        };
        return HexGame;
    }());
    app.HexGame = HexGame;
})(app || (app = {}));
var app;
(function (app) {
    function svgText(text) {
        var svgNS = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        var textEl = document.createElementNS(svgNS, "text");
        textEl.setAttribute("font-size", "80");
        textEl.setAttribute("fill", "#fff");
        textEl.setAttribute("text-anchor", "middle");
        textEl.setAttribute("x", "50%");
        textEl.setAttribute("y", "84");
        textEl.textContent = text;
        svg.appendChild(textEl);
        return svg;
    }
    var SideView = (function () {
        function SideView() {
            this.turnImage = app.ui.img("assets/demo/turn_a.png");
            this.turnLabelSvg = svgText("12");
            this.turnLabelText = this.turnLabelSvg.getElementsByTagName("text")[0];
            this.pointsLabel = jsx("div", { class: "game-score-text" }, "1234");
            this.countLabel = jsx("div", { class: "game-score-text" }, "1234");
            this.timeLabel = jsx("div", { class: "game-time-text" }, "12:34");
            this.html = jsx("div", { class: "game-side" },
                jsx("div", { class: "game-turn" },
                    this.turnImage,
                    jsx("div", { class: "game-turn-label" }, this.turnLabelSvg)),
                jsx("div", { class: "game-score" },
                    app.ui.img("assets/demo/points_icon.png"),
                    this.pointsLabel,
                    app.ui.img("assets/demo/count_icon.png"),
                    this.countLabel),
                jsx("div", { class: "game-avatar" },
                    app.ui.img("assets/demo/avatar.png"),
                    this.timeLabel));
        }
        SideView.prototype.refresh = function (player) {
            this.turnLabelText.textContent = player.currentTurn.toString();
            this.pointsLabel.innerText = player.points.toString();
            this.countLabel.innerText = player.count.toString();
            this.timeLabel.innerText = app.format.timeMMSS(player.time);
        };
        return SideView;
    }());
    app.SideView = SideView;
})(app || (app = {}));
//# sourceMappingURL=main.js.map