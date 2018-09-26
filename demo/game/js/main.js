var app;
(function (app) {
    var _scene;
    var _windowWidth = 0;
    var _windowHeight = 0;
    var _canvasWidth = 0;
    var _canvasHeight = 0;
    var _renderWidth = 0;
    var _renderHeight = 0;
    var fps_el;
    var info_el;
    var rendererInfo = "";
    function init() {
        fps_el = document.getElementById("fps_text");
        info_el = document.getElementById("info_text");
        app.pixi = new PIXI.Application(800, 600, {
            transparent: false,
            autoResize: false,
            autoStart: false,
            clearBeforeRender: false,
        });
        rendererInfo = app.pixi.renderer.gl || app.pixi.renderer.context;
        document.body.appendChild(app.pixi.view);
        adjustSize();
        app.pixi.start();
        app.pixi.ticker.add(onUpdate);
        fl.Bundle.version = new Date().getTime().toString();
        fl.Bundle.load("demo", onBundleLoaded);
    }
    app.init = init;
    function onBundleLoaded() {
        _scene = new app.Demo();
        _scene.init();
        resizeScene();
    }
    function resizeScene() {
        _scene.resize(_renderWidth, _renderHeight);
    }
    var _last = Date.now();
    var _time = [];
    function updateStats() {
        let now = Date.now();
        let t = now - _last;
        _last = now;
        _time.push(t);
        if (_time.length < 30)
            return;
        let av_time = 0;
        let max_time = 0;
        for (let i = 0; i < _time.length; i++) {
            av_time += _time[i];
            if (_time[i] > max_time)
                max_time = _time[i];
        }
        fps_el.innerText = "av: " + (av_time / _time.length).toFixed(1) + "\nmax: " + max_time;
        _time.length = 0;
    }
    function onUpdate() {
        updateStats();
        adjustSize();
        if (_scene)
            _scene.update();
    }
    function adjustSize() {
        const MAX_BUF = 1920;
        let w = window.innerWidth;
        let h = window.innerHeight;
        if (w != _windowWidth || h != _windowHeight) {
            _windowWidth = w;
            _windowHeight = h;
            _canvasWidth = Math.max(w, 400);
            _canvasHeight = Math.min(h, w);
            let dpi = window.devicePixelRatio;
            let resolution = Math.min(dpi, 2.0);
            _renderWidth = _canvasWidth * resolution;
            _renderHeight = _canvasHeight * resolution;
            if (_renderWidth > MAX_BUF) {
                let k = MAX_BUF / _renderWidth;
                _renderWidth = _renderWidth * k;
                _renderHeight = _renderHeight * k;
            }
            _renderWidth = Math.round(_renderWidth);
            _renderHeight = Math.round(_renderHeight);
            app.pixi.renderer.resize(_renderWidth, _renderHeight);
            app.pixi.view.style.width = _canvasWidth + "px";
            app.pixi.view.style.height = _canvasHeight + "px";
            if (_scene)
                resizeScene();
            let sizeInfo = `${_canvasWidth} x ${_canvasHeight} (${_renderWidth} x ${_renderHeight})`;
            console.log(`resize: ${sizeInfo}`);
            info_el.innerText = `${window.navigator.userAgent}\ndpi: ${dpi} ${sizeInfo} ${rendererInfo}`;
        }
    }
})(app || (app = {}));
var app;
(function (app) {
    const BASE_WIDTH = 1024;
    const BASE_HEIGHT = 768;
    class Demo {
        constructor() {
            this.speed = 4;
            this.width = BASE_WIDTH;
            this.height = BASE_HEIGHT;
            this.places = [];
        }
        init() {
            this.bg = fl.Bundle.createSprite("demo/bg");
            app.pixi.stage.addChild(this.bg);
            this.hero = fl.Bundle.createSprite("demo/hero");
            app.pixi.stage.addChild(this.hero);
            for (let i = 0; i < 3; i++) {
                let place = fl.Bundle.createSprite("demo/ground");
                app.pixi.stage.addChild(place);
                this.places.push(place);
            }
            this.sprite = fl.Bundle.createSprite("demo/digit_2");
            this.sprite.x = 200;
            this.sprite.y = 200;
            app.pixi.stage.addChild(this.sprite);
        }
        update() {
            this.sprite.x += this.speed;
            if (this.speed > 0 && this.sprite.x > 400)
                this.speed = -this.speed;
            if (this.speed < 0 && this.sprite.x < 200)
                this.speed = -this.speed;
            for (let i = 0; i < 3; i++) {
                let place = this.places[i];
                place.x = 500 + i * 300 - this.sprite.x;
                place.y = this.height;
            }
            this.hero.x = 200;
            this.hero.y = this.height - 200 - this.sprite.x;
        }
        resize(width, height) {
            this.width = width;
            this.height = height;
            this.bg.width = width;
            this.bg.height = height;
        }
    }
    app.Demo = Demo;
})(app || (app = {}));
function jsx(tag, attrs, children) {
    let element = document.createElement(tag);
    for (let name in attrs) {
        if (name && attrs.hasOwnProperty(name)) {
            let value = attrs[name];
            if (value === true)
                element.setAttribute(name, name);
            else if (value !== false && value != null)
                element.setAttribute(name, value.toString());
        }
    }
    for (let i = 2; i < arguments.length; i++) {
        let child = arguments[i];
        let childNode = child.nodeType == null
            ? document.createTextNode(child.toString())
            : child;
        element.appendChild(childNode);
    }
    return element;
}
var fl;
(function (fl) {
    class Anchor {
        constructor(source, sourceProperty, target, targetProperty, multiplier = 1.0) {
            this._target = target;
            this._targetProperty = targetProperty;
            this._source = source;
            this._sourceProperty = sourceProperty;
            this._multiplier = multiplier;
            this._distance = source[sourceProperty] * multiplier - target[targetProperty];
        }
        apply() {
            this._target[this._targetProperty] = this._source[this._sourceProperty] * this._multiplier - this._distance;
        }
    }
    fl.Anchor = Anchor;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class Internal {
        static dispatchLabels(target) {
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
        }
        static applyColor(target) {
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
        }
        static clampRange(value, min, max) {
            if (value < min)
                return min;
            else if (value > max)
                return max;
            else
                return value;
        }
    }
    Internal.EMPTY_ARRAY = [];
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
        return this.findAll(it => (it.name || "").indexOf(prefix) == 0);
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
        for (let child of this.children) {
            if (!child.isFrameObject)
                continue;
            var obj = child;
            if (obj.resource.name.indexOf(prefix) == 0)
                result.push(obj);
        }
        return result;
    };
    PIXI.Container.prototype.playAllChildren = function () {
        this.children.forEach((it) => {
            var animable = it;
            if (animable.totalFrames > 1)
                animable.animation.play();
        });
    };
    PIXI.Container.prototype.stopAllChildren = function () {
        this.children.forEach((it) => {
            var animable = it;
            if (animable.totalFrames > 1)
                animable.animation.stop();
        });
    };
})(PIXI || (PIXI = {}));
var fl;
(function (fl) {
    class Color {
        constructor(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        static fromNum(value) {
            var r = (value & 0xFF0000) >> 16;
            var g = (value & 0x00FF00) >> 8;
            var b = (value & 0x0000FF);
            return new Color(r / 255.0, g / 255.0, b / 255.0, 1);
        }
        clone() {
            return new Color(this.r, this.g, this.b, this.a);
        }
        setTo(value) {
            value.r = this.r;
            value.g = this.g;
            value.b = this.b;
            value.a = this.a;
        }
        setFrom(value) {
            this.r = value.r;
            this.g = value.g;
            this.b = value.b;
            this.a = value.a;
        }
    }
    fl.Color = Color;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class FlashObject extends PIXI.Container {
    }
    fl.FlashObject = FlashObject;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class FrameLabel {
    }
    fl.FrameLabel = FrameLabel;
    class FrameObject extends fl.FlashObject {
        gotoLabel(label) {
            var n = this.labels.length;
            for (var i = 0; i < n; i++) {
                if (this.labels[i].name == label) {
                    this.currentFrame = this.labels[i].frame;
                    return true;
                }
            }
            return false;
        }
        stepForward() {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;
            else
                this.currentFrame = 0;
            return this;
        }
        stepBackward() {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;
            else
                this.currentFrame = this.totalFrames - 1;
            return this;
        }
        gotoNextFrame() {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;
            return this;
        }
        gotoPrevFrame() {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;
            return this;
        }
        gotoFirstFrame() {
            this.currentFrame = 0;
            return this;
        }
        gotoLastFrame() {
            this.currentFrame = this.totalFrames - 1;
            return this;
        }
        gotoRandomFrame() {
            this.currentFrame = (Math.random() * this.totalFrames) | 0;
            return this;
        }
        isFirstFrame() {
            return this.currentFrame == 0;
        }
        isLastFrame() {
            return this.currentFrame == this.totalFrames - 1;
        }
    }
    fl.FrameObject = FrameObject;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class Resource {
        constructor(id) {
            this._id = id;
        }
        createInstance() {
            throw new Error("Not implemented");
        }
        dispose() {
            throw new Error("Not implemented");
        }
        get id() {
            return this._id;
        }
        get name() {
            var id = this._id;
            return id.substr(id.lastIndexOf("/") + 1);
        }
    }
    fl.Resource = Resource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class PlaceholderResource extends fl.Resource {
        constructor(id) {
            super(id);
        }
        createInstance() {
            return new fl.Placeholder();
        }
        dispose() {
        }
    }
    fl.PlaceholderResource = PlaceholderResource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class SpriteFrame {
    }
    fl.SpriteFrame = SpriteFrame;
    class SpriteResource extends fl.Resource {
        static fromJson(data, texture) {
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
        }
        createInstance() {
            return new fl.Sprite(this);
        }
        dispose() {
            this.texture.destroy(false);
            delete this.texture;
            delete this.frames;
            delete this.labels;
        }
    }
    fl.SpriteResource = SpriteResource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class ClipResource extends fl.Resource {
        static fromJson(data) {
            var id = data.path;
            var r = new ClipResource(id);
            r.resources = data.resources;
            r.instances = ClipResource.readInstances(data.instances);
            r.frames = ClipResource.readFrames(data.frames, r.instances.length);
            r.labels = data.labels;
            return r;
        }
        static readInstances(data) {
            var instances = [];
            for (var i = 0; i < data.length; i++) {
                var props = data[i];
                var inst = new ChildInfo();
                inst.resIndex = props[0];
                inst.name = props[1];
                instances[i] = inst;
            }
            return instances;
        }
        static readFrames(data, totalInstCount) {
            var framesCount = data.length;
            var frames = [];
            for (var i = 0; i < framesCount; i++) {
                frames[i] = ClipResource.readFrame(data[i], totalInstCount);
            }
            return frames;
        }
        static readFrame(data, totalInstCount) {
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
        }
        static readInstance(data) {
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
        }
        createInstance() {
            return new fl.Clip(this);
        }
        getChildResource(childIndex) {
            var resIndex = this.instances[childIndex].resIndex;
            return this.resources[resIndex];
        }
        dispose() {
            delete this.resources;
            delete this.instances;
            delete this.frames;
            delete this.labels;
        }
    }
    fl.ClipResource = ClipResource;
    class FrameData {
        containsIndex(id) {
            return id >= 0
                && id < this.existingInstancesBits.length
                && this.existingInstancesBits[id];
        }
    }
    FrameData.EMPTY_LABELS = [];
    class ChildInfo {
    }
    class ChildProps {
        constructor() {
            this.matrixChecked = false;
        }
        applyTo(target) {
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
        }
    }
})(fl || (fl = {}));
var fl;
(function (fl) {
    class Bundle {
        constructor(name) {
            this.textures = {};
            this.resources = {};
            this.name = name;
        }
        static createPlaceholders() {
            var bundle = new Bundle("placeholders");
            bundle.resources["placeholders/empty"] = new fl.PlaceholderResource("placeholders/empty");
            return bundle;
        }
        static loadAll(bundleNames, onComplete) {
            let i = 0;
            let loadNext = () => {
                if (i < bundleNames.length) {
                    Bundle.load(bundleNames[i], loadNext);
                    i++;
                }
                else {
                    onComplete();
                }
            };
            loadNext();
        }
        static load(bundleName, onComplete) {
            console.log("Bundle.load: " + bundleName);
            var bundle = Bundle._bundles[bundleName];
            if (bundle)
                throw new Error("Bundle is already loaded: " + bundleName);
            bundle = new Bundle(bundleName);
            Bundle._bundles[bundleName] = bundle;
            bundle.load(onComplete);
        }
        static unload(bundleName) {
            console.log("Bundle.unload: " + bundleName);
            var bundle = Bundle._bundles[bundleName];
            if (!bundle)
                throw new Error("Bundle is not loaded: " + bundleName);
            delete Bundle._bundles[bundleName];
            bundle.unload();
        }
        static getResource(resourceId) {
            var bundleId = resourceId.substr(0, resourceId.indexOf('/'));
            var bundle = Bundle._bundles[bundleId];
            if (!bundle)
                throw new Error('Bundle is not loaded: ' + resourceId);
            var res = bundle.resources[resourceId];
            if (res == null)
                throw new Error('Resource not found: ' + resourceId);
            return res;
        }
        static createFlashObject(id) {
            var res = Bundle.getResource(id);
            if (res instanceof fl.SpriteResource)
                return new fl.Sprite(res);
            else if (res instanceof fl.ClipResource)
                return new fl.Clip(res);
            else
                throw new Error('Unknown resource type: ' + id);
        }
        static createSprite(id) {
            var res = Bundle.getResource(id);
            if (!(res instanceof fl.SpriteResource))
                throw new Error('Resource is not a Sprite: ' + id);
            return new fl.Sprite(res);
        }
        static createClip(id) {
            var res = Bundle.getResource(id);
            if (!(res instanceof fl.ClipResource))
                throw new Error('Resource is not a Clip: ' + id);
            return new fl.Clip(res);
        }
        load(onComplete) {
            this.completeHandler = onComplete;
            this.loadResources();
        }
        unload() {
            Object.keys(this.resources)
                .forEach(key => this.resources[key].dispose());
            Object.keys(this.textures)
                .forEach(key => this.textures[key].destroy(true));
            this.resources = {};
            this.textures = {};
        }
        loadResources() {
            let url = this.getUrl('bundle.json');
            this.verboseLog('loading: ' + url);
            let loader = new PIXI.loaders.Loader();
            loader.add('json', url);
            loader.load((it, resources) => {
                this.verboseLog('OK: ' + url);
                this.rawData = resources['json'].data;
                if (this.rawData)
                    this.loadTextures();
            });
        }
        loadTextures() {
            this.textures = {};
            var names = this.rawData["textures"];
            if (names.length > 0) {
                var loader = new PIXI.loaders.Loader;
                for (let textureName of names) {
                    var url = this.getUrl(textureName + Bundle.textureExt);
                    this.verboseLog('loading: ' + url);
                    loader.add(textureName, url, null, () => {
                        this.textures[textureName] = loader.resources[textureName].texture;
                        this.verboseLog("OK: " + textureName);
                    });
                }
                loader.load(() => {
                    this.createResources();
                    this.complete();
                });
            }
            else {
                this.createResources();
                this.complete();
            }
        }
        complete() {
            this.rawData = null;
            if (this.completeHandler != null)
                this.completeHandler();
        }
        createResources() {
            var symbols = this.rawData['symbols'];
            for (var symbol of symbols) {
                var id = symbol.path;
                this.resources[id] = this.createResource(symbol);
            }
        }
        createResource(json) {
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
        }
        verboseLog(message) {
            if (Bundle.verboseLog)
                console.log("| " + message);
        }
        getUrl(assetName) {
            return `${Bundle.rootPath}/${this.name}/${assetName}?v=${Bundle.version}`;
        }
    }
    Bundle.version = "0";
    Bundle.rootPath = "assets";
    Bundle.textureExt = ".png";
    Bundle.verboseLog = true;
    Bundle._bundles = {
        "placeholders": Bundle.createPlaceholders()
    };
    fl.Bundle = Bundle;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class Container extends PIXI.Container {
        constructor() {
            super(...arguments);
            this.timelineIndex = -1;
            this.labels = fl.Internal.EMPTY_ARRAY;
            this.color = new fl.Color(1, 1, 1, 1);
            this.isFlashObject = true;
            this.isFrameObject = false;
            this.scaleMultiplier = 1;
            this.globalColor = {};
        }
        get scaleX() { return this.scale.x * this.scaleMultiplier; }
        set scaleX(value) { this.scale.x = value / this.scaleMultiplier; }
        get scaleY() { return this.scale.y * this.scaleMultiplier; }
        set scaleY(value) { this.scale.y = value / this.scaleMultiplier; }
        get scaleXY() { return 0.5 * (this.scaleX + this.scaleY); }
        set scaleXY(value) {
            this.scaleX = value;
            this.scaleY = value;
        }
        handleFrameChange() {
        }
        updateTransform() {
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
                super.updateTransform();
            }
        }
        updateColor() {
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
        }
    }
    fl.Container = Container;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class Placeholder extends fl.Container {
        getLocalBounds() {
            return Placeholder.predefinedBounds;
        }
    }
    Placeholder.predefinedBounds = new PIXI.Rectangle(0, 0, 100, 100);
    fl.Placeholder = Placeholder;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class Sprite extends PIXI.Sprite {
        constructor(resource) {
            super();
            this.timelineIndex = -1;
            this.color = new fl.Color(1, 1, 1, 1);
            this.isFlashObject = true;
            this.isFrameObject = true;
            this.scaleMultiplier = 1;
            this._currentFrame = 0;
            this._totalFrames = 1;
            this.labels = fl.Internal.EMPTY_ARRAY;
            this.setResourceInternal(resource);
            this.scaleMultiplier = resource.scale;
            this.scaleXY = 1;
        }
        get scaleX() { return this.scale.x * this.scaleMultiplier; }
        set scaleX(value) { this.scale.x = value / this.scaleMultiplier; }
        get scaleY() { return this.scale.y * this.scaleMultiplier; }
        set scaleY(value) { this.scale.y = value / this.scaleMultiplier; }
        get scaleXY() { return 0.5 * (this.scaleX + this.scaleY); }
        set scaleXY(value) { this.scaleX = value; this.scaleY = value; }
        get totalFrames() { return this._totalFrames; }
        get currentFrame() { return this._currentFrame; }
        set currentFrame(value) {
            if (this._currentFrame != value) {
                this._currentFrame = fl.Internal.clampRange(value, 0, this._totalFrames - 1);
                this.handleFrameChange();
            }
        }
        get animation() {
            return this._animation
                || (this._animation = new fl.Animation(this));
        }
        updateTransform() {
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
                super.updateTransform();
            }
        }
        handleFrameChange() {
            var frame = this._resource.frames[this._currentFrame];
            this.anchor.set(frame.anchor.x, frame.anchor.y);
            this.texture = frame.texture;
            fl.Internal.dispatchLabels(this);
        }
        get resource() {
            return this._resource;
        }
        set resource(value) {
            this.setResourceInternal(value);
            this.currentFrame = 0;
        }
        setResourceInternal(value) {
            this._resource = value;
            this._totalFrames = value.frames.length;
            this._currentFrame = 0;
            this.labels = value.labels;
            this.handleFrameChange();
        }
        toString() {
            return 'Sprite[' + this._resource.id + ']';
        }
    }
    fl.Sprite = Sprite;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class Clip extends fl.Container {
        constructor(resource) {
            super();
            this.isFrameObject = true;
            this._currentFrame = 0;
            this._totalFrames = 1;
            this.autoPlayChildren = true;
            this._instances = [];
            this._resource = resource;
            this._totalFrames = resource.frames.length;
            this.labels = resource.labels;
            this.constructChildren();
            this.handleFrameChange();
        }
        get totalFrames() { return this._totalFrames; }
        get currentFrame() { return this._currentFrame; }
        set currentFrame(value) {
            if (this._currentFrame != value) {
                this._currentFrame = fl.Internal.clampRange(value, 0, this._totalFrames - 1);
                this.handleFrameChange();
            }
        }
        get animation() {
            return this._animation
                || (this._animation = new fl.Animation(this));
        }
        constructChildren() {
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
        }
        handleFrameChange() {
            this.updateChildren();
            fl.Internal.dispatchLabels(this);
        }
        updateChildren() {
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
        }
        getTimeLineItem(instanceId) {
            var instance = this._instances[instanceId];
            instance.timelineIndex = instanceId;
            if (instance.isFrameObject) {
                var frameObj = instance;
                frameObj.currentFrame = 0;
            }
            return instance;
        }
        get resource() {
            return this._resource;
        }
        toString() {
            return 'Clip[' + this._resource.id + ']';
        }
        tryGetElement(name) {
            var n = this._instances.length;
            for (var i = 0; i < n; i++) {
                var inst = this._instances[i];
                if (inst.name == name)
                    return inst;
            }
            return null;
        }
        getElement(name) {
            var element = this.tryGetElement(name);
            if (element)
                return element;
            else
                throw new Error("Instance not found: " + name);
        }
        get instances() {
            return this._instances;
        }
    }
    fl.Clip = Clip;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class Button {
        constructor(target, action) {
            this._enabled = true;
            fl.assertPresent(target, "targetCell");
            this.content = target;
            if (action)
                this.onRelease = action;
            this.content.on("mousedown", (e) => {
                this.setDownState();
                if (this.onPress)
                    this.onPress(this, e);
            });
            this.content.on("mouseup", (e) => {
                this.setUpState();
                if (this.onRelease)
                    this.onRelease(this, e);
            });
            this.content.on("mouseupoutside", () => {
                this.setUpState();
            });
            this.content.on("touchstart", (e) => {
                this.setDownState();
                if (this.onPress)
                    this.onPress(this, e);
            });
            this.content.on("touchend", (e) => {
                this.setUpState();
                if (this.onRelease)
                    this.onRelease(this, e);
            });
            this.content.on("touchendoutside", () => {
                this.setUpState();
            });
            this.refreshEnabledState();
        }
        get enabled() { return this._enabled; }
        set enabled(value) {
            if (this._enabled != value) {
                this._enabled = value;
                this.refreshEnabledState();
            }
        }
        refreshEnabledState() {
            this.content.interactive = this._enabled;
            this.content.buttonMode = this._enabled;
        }
        setDownState() {
            var states = this.content;
            if (states.isFlashObject) {
                states.currentFrame = 1;
                states.updateTransform();
            }
        }
        setUpState() {
            var states = this.content;
            if (states.isFlashObject) {
                states.currentFrame = 0;
                states.updateTransform();
            }
        }
    }
    fl.Button = Button;
})(fl || (fl = {}));
var fl;
(function (fl) {
    class Text extends PIXI.Text {
        constructor(text, style) {
            super(text, style);
            this.timelineIndex = -1;
            this.color = new fl.Color(1, 1, 1, 1);
            this.isFlashObject = true;
            this.isFrameObject = false;
            this.scaleMultiplier = 1;
            this.isTextField = true;
            this._xCorrection = 0;
            this._yCorrection = 0;
        }
        static fromData(data) {
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
        }
        get scaleX() { return this.scale.x * this.scaleMultiplier; }
        set scaleX(value) { this.scale.x = value / this.scaleMultiplier; }
        get scaleY() { return this.scale.y * this.scaleMultiplier; }
        set scaleY(value) { this.scale.y = value / this.scaleMultiplier; }
        get scaleXY() { return 0.5 * (this.scaleX + this.scaleY); }
        set scaleXY(value) {
            this.scaleX = value;
            this.scaleY = value;
        }
        updateTransform() {
            fl.Internal.applyColor(this);
            super.updateTransform();
        }
    }
    fl.Text = Text;
})(fl || (fl = {}));
var fl;
(function (fl) {
    applyMixins(fl.Container, fl.FlashObject);
    applyMixins(fl.Clip, fl.FrameObject);
    applyMixins(fl.Sprite, fl.FlashObject);
    applyMixins(fl.Sprite, fl.FrameObject);
    function applyMixins(derived, base) {
        Object.getOwnPropertyNames(base.prototype).forEach(name => {
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
    class Animation {
        constructor(target) {
            this.ticksPerFrame = Animation.defaultTicksPerFrame;
            this.isActive = false;
            this._innerActive = true;
            this._innerJump = undefined;
            this._innerCond = undefined;
            this._target = target;
        }
        static sendSignal(signal) {
            Animation.signals[signal] = 1;
        }
        parseCondition(raw) {
            if (this._innerCond === undefined) {
                this._innerCond = Number(raw);
                if (isNaN(this._innerCond)) {
                    this._innerCond = raw;
                    delete Animation.signals[this._innerCond];
                }
            }
        }
        parseJump(raw) {
            this._innerJump = Number(raw) - 1;
            if (isNaN(this._innerJump))
                this._innerJump = raw;
        }
        applyControlLabel(label) {
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
        }
        updateByParent() {
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
            let innerCond = this._innerCond;
            if (typeof (innerCond) == "number" && innerCond > 0)
                this._innerCond = innerCond - 1;
        }
        update() {
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
        }
        playTo(endFrame) {
            this._looping = false;
            this._endFrame = fl.Internal.clampRange(endFrame, 0, this._target.totalFrames - 1);
            this._step = this._endFrame > this._target.currentFrame ? 1 : -1;
            this._innerCond = undefined;
            this._innerJump = undefined;
            this.isActive = true;
        }
        playLoop(step) {
            this._looping = true;
            this._step = step;
            this._innerCond = undefined;
            this._innerJump = undefined;
            this.isActive = true;
        }
        stop() {
            this._innerCond = undefined;
            this._innerJump = undefined;
            this.isActive = false;
        }
        play() {
            this.playLoop(1);
        }
        playReverse() {
            this.playLoop(-1);
        }
        playToBegin() {
            this.playTo(0);
        }
        playToEnd() {
            this.playTo(this._target.totalFrames - 1);
        }
        playFromBeginToEnd() {
            this._target.currentFrame = 0;
            this.playToEnd();
        }
        playFromEndToBegin() {
            this._target.currentFrame = this._target.totalFrames - 1;
            this.playToBegin();
        }
        gotoAndStop(frameNum) {
            this._target.currentFrame = frameNum;
            this.stop();
        }
        gotoAndPlay(frameNum) {
            this._target.currentFrame = frameNum;
            this.play();
        }
        onComplete(handler) {
            this._completeHandler = handler;
            return this;
        }
    }
    Animation.defaultTicksPerFrame = 1;
    Animation.signals = {};
    fl.Animation = Animation;
})(fl || (fl = {}));
//# sourceMappingURL=main.js.map