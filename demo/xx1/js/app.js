var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dom;
(function (dom) {
    function get(id) {
        var el = document.getElementById(id);
        if (!el)
            throw "Element not found, id=\"" + id + "\"";
        return el;
    }
    dom.get = get;
    function getByClass(className) {
        var elements = document.getElementsByClassName(className);
        if (elements.length === 0)
            throw "Element not found, class=\"" + className + "\"";
        return elements[0];
    }
    dom.getByClass = getByClass;
    function hasTouchSupport() {
        return 'ontouchstart' in window || Boolean(navigator.msMaxTouchPoints);
    }
    dom.hasTouchSupport = hasTouchSupport;
})(dom || (dom = {}));
var log;
(function (log) {
    log.debugMode = false;
    var debugElement = null;
    var fpsElement = null;
    function trace(str) {
        console.log(str);
        if (log.debugMode) {
            if (!debugElement)
                document.body.appendChild(debugElement = document.createElement("div"));
            debugElement.appendChild(document.createElement("td"));
            debugElement.appendChild(document.createTextNode(str));
        }
    }
    log.trace = trace;
    var prev_time = 0;
    var fpsDisplayCounter = 0;
    function showFps() {
        var time = Date.now();
        var fps = 1000 / (time - prev_time);
        prev_time = time;
        if (!fpsElement) {
            fpsElement = document.createElement("div");
            fpsElement.style.position = 'absolute';
            fpsElement.style.top = '8px';
            fpsElement.style.left = '8px';
            document.body.appendChild(fpsElement);
        }
        if (--fpsDisplayCounter < 0) {
            fpsElement.innerText = fps.toFixed();
            fpsDisplayCounter = 20;
        }
    }
    log.showFps = showFps;
})(log || (log = {}));
var sound;
(function (sound) {
    sound.enabled = true;
    var _currentSound = null;
    var _currentName = null;
    var _playingMap = {};
    function isPlaying(name) {
        return (name in _playingMap);
    }
    sound.isPlaying = isPlaying;
    function playRandom(names) {
        play(names[Math.floor(Math.random() * names.length)]);
    }
    sound.playRandom = playRandom;
    function play(name) {
        if (!sound.enabled)
            return;
        stop();
        var url = "snd/" + name + ".ogg";
        log.trace("sound: " + url);
        _currentName = name;
        _currentSound = new Howl({
            src: url,
            volume: 1.0,
            autoplay: true,
            loop: false,
            onend: function () {
                delete _playingMap[name];
                if (sound.onSoundComplete)
                    sound.onSoundComplete(name);
            },
            onloaderror: function (soundId, e) {
                delete _playingMap[name];
                if (sound.onSoundError)
                    sound.onSoundError(name);
                log.trace(e.message);
            },
        });
        _playingMap[name] = _currentSound;
    }
    sound.play = play;
    function stop() {
        if (!sound.enabled)
            return;
        if (!_currentSound)
            return;
        delete _playingMap[_currentName];
        var localRef = _currentSound;
        _currentSound.fade(localRef.volume(), 0, 200)
            .on('fade', function () { return localRef.unload(); });
        _currentSound = null;
        _currentName = null;
    }
    sound.stop = stop;
})(sound || (sound = {}));
var app;
(function (app) {
    var GameBase = (function () {
        function GameBase() {
            this.screenWidth = app.BASE_WIDTH;
            this.screenHeight = app.BASE_HEIGHT;
        }
        GameBase.prototype.initialize = function () {
            this.onInitialize();
        };
        GameBase.prototype.resize = function (width, height) {
            this.screenWidth = width;
            this.screenHeight = height;
            this.onResize();
        };
        GameBase.prototype.update = function () {
            this.onUpdate();
        };
        return GameBase;
    }());
    app.GameBase = GameBase;
})(app || (app = {}));
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
        return this.findAll(function (it) {
            return it.name && it.name.indexOf(prefix) == 0;
        });
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
                    Animation.signals[this._innerCond] = undefined;
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
            if (this._innerCond > 0)
                this._innerCond = this._innerCond - 1;
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
            Bundle._bundles[bundleName] = null;
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
                new fl.Clip(res);
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
            new PIXI.loaders.Loader().add('json', url).load(function (loader, resources) {
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
            set: function (value) { this.scaleX = value; this.scaleY = value; },
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
                this._currentBounds = null;
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
            this.resources = null;
            this.instances = null;
            this.frames = null;
            this.labels = null;
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
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(resource) {
            var _this = _super.call(this, null) || this;
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
                this._currentBounds = null;
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
            this.texture = null;
            this.frames = null;
            this.labels = null;
        };
        return SpriteResource;
    }(fl.Resource));
    fl.SpriteResource = SpriteResource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Placeholder = (function (_super) {
        __extends(Placeholder, _super);
        function Placeholder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Placeholder.prototype.getBounds = function (matrix) {
            if (!this._currentBounds) {
                var bounds = Placeholder.predefinedBounds;
                var w0 = bounds.x;
                var w1 = bounds.width + bounds.x;
                var h0 = bounds.y;
                var h1 = bounds.height + bounds.y;
                var worldTransform = matrix || this.worldTransform;
                var a = worldTransform.a;
                var b = worldTransform.b;
                var c = worldTransform.c;
                var d = worldTransform.d;
                var tx = worldTransform.tx;
                var ty = worldTransform.ty;
                var x1 = a * w1 + c * h1 + tx;
                var y1 = d * h1 + b * w1 + ty;
                var x2 = a * w0 + c * h1 + tx;
                var y2 = d * h1 + b * w0 + ty;
                var x3 = a * w0 + c * h0 + tx;
                var y3 = d * h0 + b * w0 + ty;
                var x4 = a * w1 + c * h0 + tx;
                var y4 = d * h0 + b * w1 + ty;
                var maxX = x1;
                var maxY = y1;
                var minX = x1;
                var minY = y1;
                minX = x2 < minX ? x2 : minX;
                minX = x3 < minX ? x3 : minX;
                minX = x4 < minX ? x4 : minX;
                minY = y2 < minY ? y2 : minY;
                minY = y3 < minY ? y3 : minY;
                minY = y4 < minY ? y4 : minY;
                maxX = x2 > maxX ? x2 : maxX;
                maxX = x3 > maxX ? x3 : maxX;
                maxX = x4 > maxX ? x4 : maxX;
                maxY = y2 > maxY ? y2 : maxY;
                maxY = y3 > maxY ? y3 : maxY;
                maxY = y4 > maxY ? y4 : maxY;
                bounds = this._bounds;
                bounds.x = minX;
                bounds.width = maxX - minX;
                bounds.y = minY;
                bounds.height = maxY - minY;
                this._currentBounds = bounds;
            }
            return this._currentBounds;
        };
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
    var Button = (function () {
        function Button(target, action) {
            var _this = this;
            this._enabled = true;
            fl.assertPresent(target, "targetCell");
            this.content = target;
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
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(text, style) {
            var _this = _super.call(this, text, style, window.devicePixelRatio) || this;
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
            style.font = (data.bold ? "bold " : "")
                + (data.italic ? "italic " : "")
                + (data.fontSize + "px ")
                + data.fontName;
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
            var field = new fl.Text(text, style);
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
            set: function (value) { this.scaleX = value; this.scaleY = value; },
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
var app;
(function (app) {
    var HtmlButton = (function () {
        function HtmlButton(content, onClick) {
            var _this = this;
            this.isPressed = false;
            this.isVisible = true;
            this.content = content;
            this.onClick = onClick;
            this.displayStyle = content.style.display;
            var images = content.getElementsByClassName("btn-img");
            this.imgDn = images[0];
            this.imgDn.ondragstart = function () { return false; };
            this.imgUp = images[1];
            this.imgUp.ondragstart = function () { return false; };
            content.addEventListener('mousedown', function () { return _this.onPress(); }, false);
            content.addEventListener('mouseup', function () { return _this.onRelease(); }, false);
            content.addEventListener('mouseleave', function () { return _this.onLeave(); }, false);
            content.addEventListener("touchstart", function (e) {
                e.preventDefault();
                _this.onPress();
            }, false);
            content.addEventListener("touchend", function (e) {
                e.preventDefault();
                return _this.onRelease();
            }, false);
            content.addEventListener("touchcancel", function (e) {
                e.preventDefault();
                return _this.onLeave();
            }, false);
            this.refresh();
        }
        HtmlButton.prototype.refresh = function () {
            this.imgUp.style.visibility = !this.isPressed ? 'visible' : 'hidden';
            this.imgDn.style.visibility = this.isPressed ? 'visible' : 'hidden';
        };
        HtmlButton.prototype.onPress = function () {
            if (!this.isPressed) {
                console.log("press: " + this.content.id);
                this.isPressed = true;
                this.refresh();
            }
        };
        HtmlButton.prototype.onRelease = function () {
            if (this.isPressed) {
                console.log("release: " + this.content.id);
                this.isPressed = false;
                this.refresh();
                setTimeout(this.onClick);
            }
        };
        HtmlButton.prototype.onLeave = function () {
            this.isPressed = false;
            this.refresh();
        };
        Object.defineProperty(HtmlButton.prototype, "visible", {
            get: function () {
                return this.isVisible;
            },
            set: function (value) {
                if (this.isVisible != value) {
                    this.isVisible = value;
                    this.content.style.display = this.isVisible ? this.displayStyle : 'none';
                }
            },
            enumerable: true,
            configurable: true
        });
        return HtmlButton;
    }());
    app.HtmlButton = HtmlButton;
})(app || (app = {}));
var app;
(function (app) {
    var HtmlFrame = (function () {
        function HtmlFrame(elements) {
            this._frameNum = 0;
            this.elements = elements.slice();
            this.refresh();
        }
        HtmlFrame.prototype.refresh = function () {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].style.visibility = (i == this._frameNum)
                    ? 'visible'
                    : 'hidden';
            }
        };
        Object.defineProperty(HtmlFrame.prototype, "frameNum", {
            get: function () {
                return this._frameNum;
            },
            set: function (value) {
                if (this._frameNum != value) {
                    this._frameNum = value;
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });
        return HtmlFrame;
    }());
    app.HtmlFrame = HtmlFrame;
})(app || (app = {}));
var app;
(function (app) {
    var TICKS_PER_FRAME = 1;
    var REPEAT_MODE = true;
    var COLOR_NEW = "#0099CC";
    var COLOR_OLD = "#000000";
    var LINE_SIZE = 5;
    var POINT_SIZE = 4;
    var CANVAS_REF_WIDTH = 700;
    var CANVAS_REF_HEIGHT = 300;
    var CANVAS_PROP = CANVAS_REF_WIDTH / CANVAS_REF_HEIGHT;
    var MAX_BUF_WIDTH = 1920;
    var GameMode;
    (function (GameMode) {
        GameMode[GameMode["NONE"] = 0] = "NONE";
        GameMode[GameMode["ANIM"] = 1] = "ANIM";
        GameMode[GameMode["DRAW"] = 2] = "DRAW";
    })(GameMode || (GameMode = {}));
    var AnimState;
    (function (AnimState) {
        AnimState[AnimState["IDLE"] = 0] = "IDLE";
        AnimState[AnimState["PLAYING"] = 1] = "PLAYING";
        AnimState[AnimState["PAUSED"] = 2] = "PAUSED";
        AnimState[AnimState["COMPLETED"] = 3] = "COMPLETED";
    })(AnimState || (AnimState = {}));
    var WritingGame = (function (_super) {
        __extends(WritingGame, _super);
        function WritingGame() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isDrawing = false;
            _this.lastSound = "none";
            _this.isRepeating = false;
            _this.mode = GameMode.NONE;
            return _this;
        }
        WritingGame.prototype.onInitialize = function () {
            var _this = this;
            var canvas_el = dom.get("canvas_el");
            var canvas_px = dom.get("canvas_px");
            document.body.addEventListener("touchstart", function (e) {
                if (e.target == canvas_el || e.target == canvas_px)
                    e.preventDefault();
            }, false);
            document.body.addEventListener("touchend", function (e) {
                if (e.target == canvas_el || e.target == canvas_px)
                    e.preventDefault();
            }, false);
            document.body.addEventListener("touchmove", function (e) {
                if (e.target == canvas_el || e.target == canvas_px)
                    e.preventDefault();
            }, false);
            this.letterAnim = new LetterAnim(canvas_px);
            this.drawCanvas = new DrawCanvas(canvas_el);
            this.drawCanvas.onPress = function () { return _this.onCanvasPress(); };
            this.drawCanvas.onRelease = function () { return _this.onCanvasRelease(); };
            this.btnPlay = new app.HtmlButton(dom.get("btn_play"), function () { return _this.onPlayClick(); });
            this.btnPause = new app.HtmlButton(dom.get("btn_pause"), function () { return _this.onPauseClick(); });
            this.btnDraw = new app.HtmlButton(dom.get("btn_draw"), function () { return _this.onDrawClick(); });
            this.btnClear = new app.HtmlButton(dom.get("btn_clear"), function () { return _this.onClearClick(); });
            this.modeAnim = new app.HtmlFrame([dom.get("img_play_off"), dom.get("img_play_on")]);
            this.modeDraw = new app.HtmlFrame([dom.get("img_draw_off"), dom.get("img_draw_on")]);
            this.refresh();
            fl.onFrameLabel = function (t, l) { return _this.onFrameLabel(t, l); };
            sound.onSoundComplete = function () { return fl.Animation.sendSignal("snd"); };
            sound.onSoundError = function () { return fl.Animation.sendSignal("snd"); };
            sound.play("title");
        };
        WritingGame.prototype.onResize = function () {
            var title = dom.getByClass("title");
            var buttons = dom.getByClass("buttons");
            var content = dom.get("content");
            var maxHeight = this.screenHeight - title.offsetHeight - buttons.offsetHeight;
            var maxWidth = content.offsetWidth;
            maxWidth = Math.max(maxWidth, 400);
            maxHeight = Math.max(maxHeight, 200);
            var workingWidth, workingHeight;
            if (maxWidth / maxHeight > CANVAS_PROP) {
                workingHeight = maxHeight;
                workingWidth = workingHeight * CANVAS_PROP;
            }
            else {
                workingWidth = maxWidth;
                workingHeight = workingWidth / CANVAS_PROP;
            }
            var canvasBox = dom.getByClass("canvas-box");
            canvasBox.style.width = workingWidth + "px";
            canvasBox.style.height = workingHeight + "px";
            content.style.marginTop = Math.floor(0.5 * (maxHeight - workingHeight)) + "px";
            var canvas = this.drawCanvas.canvas;
            var scale = Math.min(window.devicePixelRatio);
            var bufWidth = Math.min(Math.floor(workingWidth * scale), MAX_BUF_WIDTH);
            var bufHeight = Math.floor(bufWidth / CANVAS_PROP);
            canvas.width = bufWidth;
            canvas.height = bufHeight;
            scale = bufWidth / canvas.offsetWidth;
            canvas.getContext("2d").transform(scale, 0, 0, scale, 0, 0);
            this.drawCanvas.clear();
            this.letterAnim.renderer.resize(bufWidth, bufHeight);
            this.letterAnim.scene.scaleXY = bufWidth / CANVAS_REF_WIDTH;
            sound.stop();
            this.drawCanvas.clear();
            this.letterAnim.stop();
            this.mode = GameMode.NONE;
            this.refresh();
        };
        WritingGame.prototype.onUpdate = function () {
            if (REPEAT_MODE) {
                if (this.letterAnim.state == AnimState.COMPLETED) {
                    this.letterAnim.play();
                    this.drawCanvas.clear();
                    this.isRepeating = true;
                }
            }
            if (this.letterAnim.state == AnimState.PLAYING)
                this.updateAnim();
            else if (this.isDrawing)
                this.updateDrawing();
            this.letterAnim.render();
            this.refresh();
        };
        WritingGame.prototype.refresh = function () {
            this.btnPlay.visible = this.letterAnim.state != AnimState.PLAYING;
            this.btnPause.visible = this.letterAnim.state == AnimState.PLAYING;
            this.btnDraw.visible = this.mode != GameMode.DRAW;
            this.btnClear.visible = this.mode == GameMode.DRAW;
            this.modeAnim.frameNum = this.mode == GameMode.ANIM ? 1 : 0;
            this.modeDraw.frameNum = this.mode == GameMode.DRAW ? 1 : 0;
        };
        WritingGame.prototype.onFrameLabel = function (target, label) {
            if (label.indexOf("s_") == 0) {
                this.lastSound = label;
                if (!this.isRepeating)
                    sound.play(label);
            }
            else if (label == "#wait_snd" && !sound.isPlaying(this.lastSound)) {
                fl.Animation.sendSignal("snd");
            }
        };
        WritingGame.prototype.onPlayClick = function () {
            if (this.letterAnim.state == AnimState.COMPLETED || this.letterAnim.state == AnimState.IDLE) {
                this.letterAnim.stop();
                this.drawCanvas.clear();
            }
            this.letterAnim.play();
            this.isRepeating = false;
            this.mode = GameMode.ANIM;
            this.refresh();
        };
        WritingGame.prototype.onDrawClick = function () {
            sound.stop();
            this.drawCanvas.clear();
            this.letterAnim.stop();
            this.mode = GameMode.DRAW;
            this.refresh();
        };
        WritingGame.prototype.onPauseClick = function () {
            sound.stop();
            this.letterAnim.pause();
            this.refresh();
        };
        WritingGame.prototype.onClearClick = function () {
            this.drawCanvas.clear();
            this.refresh();
        };
        WritingGame.prototype.updateAnim = function () {
            var p = this.letterAnim.getPointerPos();
            if (p == null) {
                this.drawCanvas.endLine(false);
                return;
            }
            var canvas = this.drawCanvas.canvas;
            p.x *= canvas.offsetWidth / CANVAS_REF_WIDTH;
            p.y *= canvas.offsetHeight / CANVAS_REF_HEIGHT;
            this.drawCanvas.drawLine(p, LINE_SIZE, false);
        };
        WritingGame.prototype.updateDrawing = function () {
            this.drawCanvas.drawLine(this.drawCanvas.mousePos, LINE_SIZE, true);
        };
        WritingGame.prototype.onCanvasPress = function () {
            if (this.mode == GameMode.DRAW)
                this.isDrawing = true;
        };
        WritingGame.prototype.onCanvasRelease = function () {
            if (this.mode == GameMode.DRAW) {
                this.drawCanvas.endLine(true);
                this.isDrawing = false;
            }
        };
        return WritingGame;
    }(app.GameBase));
    app.WritingGame = WritingGame;
    var DrawCanvas = (function () {
        function DrawCanvas(canvas) {
            var _this = this;
            this.mousePos = { x: 0, y: 0 };
            this.px = [];
            this.py = [];
            this.lastDrawPos = { x: 0, y: 0 };
            this.canvas = canvas;
            canvas.addEventListener('mousedown', function (e) { return _this.handleMouse(e, _this.onPress); });
            canvas.addEventListener('mouseup', function (e) { return _this.handleMouse(e, _this.onRelease); });
            canvas.addEventListener('mouseleave', function (e) { return _this.handleMouse(e, _this.onRelease); });
            canvas.addEventListener('mousemove', function (e) { return _this.handleMouse(e, null); });
            canvas.addEventListener("touchstart", function (e) { return _this.handleTouch(e, _this.onPress); }, false);
            canvas.addEventListener("touchend", function (e) { return _this.handleTouch(e, _this.onRelease); }, false);
            canvas.addEventListener("touchcancel", function (e) { return _this.handleTouch(e, _this.onRelease); }, false);
            canvas.addEventListener("touchmove", function (e) { return _this.handleTouch(e, null); }, false);
        }
        DrawCanvas.prototype.endLine = function (smooth) {
            var px = this.px;
            var py = this.py;
            var len = px.length;
            if (len == 0)
                return;
            var c = this.getContext();
            if (len == 1) {
                c.beginPath();
                c.fillStyle = COLOR_OLD;
                c.arc(px[0], py[0], POINT_SIZE, 0, 2 * Math.PI);
                c.fill();
            }
            else {
                c.strokeStyle = COLOR_OLD;
                c.lineCap = 'round';
                c.beginPath();
                c.moveTo(px[0], py[0]);
                for (var i = 1; i < len; i++) {
                    if (smooth) {
                        if (i == 1) {
                            c.lineTo(0.5 * (px[0] + px[1]), 0.5 * (py[0] + py[1]));
                            c.stroke();
                        }
                        else {
                            var prevX = px[i - 1];
                            var prevY = py[i - 1];
                            var nextX = px[i];
                            var nextY = py[i];
                            var bx = 0.5 * (prevX + nextX);
                            var by = 0.5 * (prevY + nextY);
                            c.quadraticCurveTo(prevX, prevY, bx, by);
                        }
                    }
                    else {
                        c.lineTo(px[i], py[i]);
                    }
                }
                c.stroke();
            }
            this.px.length = 0;
            this.py.length = 0;
        };
        DrawCanvas.prototype.drawLine = function (position, lineWidth, smooth) {
            var minStep = smooth ? 4 : 1;
            var px = this.px;
            var py = this.py;
            var len = px.length;
            var nextX = position.x;
            var nextY = position.y;
            var prevX = 0;
            var prevY = 0;
            if (len == 0) {
                px[0] = nextX;
                py[0] = nextY;
            }
            else {
                prevX = px[len - 1];
                prevY = py[len - 1];
                var dx = nextX - prevX;
                var dy = nextY - prevY;
                var distSquared = dx * dx + dy * dy;
                if (distSquared > minStep * minStep) {
                    px[len] = nextX;
                    py[len] = nextY;
                }
                else {
                    return;
                }
            }
            len = px.length;
            if (len < 2)
                return;
            var c = this.getContext();
            c.lineCap = 'round';
            c.strokeStyle = COLOR_NEW;
            c.lineWidth = lineWidth;
            var draw = this.lastDrawPos;
            if (smooth) {
                if (len == 2) {
                    c.beginPath();
                    c.moveTo(px[0], py[0]);
                    draw.x = 0.5 * (px[0] + px[1]);
                    draw.y = 0.5 * (py[0] + py[1]);
                    c.lineTo(draw.x, draw.y);
                    c.stroke();
                }
                else {
                    c.beginPath();
                    c.moveTo(draw.x, draw.y);
                    draw.x = 0.5 * (prevX + nextX);
                    draw.y = 0.5 * (prevY + nextY);
                    c.quadraticCurveTo(prevX, prevY, draw.x, draw.y);
                    c.stroke();
                }
            }
            else {
                c.beginPath();
                c.moveTo(prevX, prevY);
                c.lineTo(nextX, nextY);
                c.stroke();
            }
        };
        DrawCanvas.prototype.clear = function () {
            this.getContext()
                .clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
            this.px.length = 0;
            this.py.length = 0;
        };
        DrawCanvas.prototype.getContext = function () {
            return this.canvas.getContext('2d');
        };
        DrawCanvas.prototype.handleMouse = function (e, handler) {
            this.mousePos.x = e.offsetX;
            this.mousePos.y = e.offsetY;
            if (handler)
                handler();
        };
        DrawCanvas.prototype.handleTouch = function (e, handler) {
            if (e.touches.length > 0) {
                var canvas = this.canvas;
                var touch = e.touches[0];
                var rect = canvas.getBoundingClientRect();
                this.mousePos.x = touch.pageX - rect.left;
                this.mousePos.y = touch.pageY - rect.top;
            }
            if (handler)
                handler();
        };
        return DrawCanvas;
    }());
    var LetterAnim = (function () {
        function LetterAnim(canvas) {
            var _this = this;
            this.state = AnimState.IDLE;
            canvas.style.pointerEvents = 'none';
            var width = canvas.width;
            var height = canvas.height;
            var options = {
                view: canvas,
                transparent: true,
                clearBeforeRender: true,
            };
            var renderer = new PIXI.CanvasRenderer(width, height, options);
            var scene = fl.Bundle.createClip(app.bundleId + "/scene");
            var clip = scene.getElement("pointer");
            clip.visible = false;
            clip.animation.onComplete(function () { return _this.state = AnimState.COMPLETED; });
            clip.animation.ticksPerFrame = TICKS_PER_FRAME;
            scene.getChildAt(0).visible = false;
            this.renderer = renderer;
            this.canvas = canvas;
            this.scene = scene;
            this.clip = clip;
        }
        LetterAnim.prototype.render = function () {
            if (this.clip.visible)
                this.renderer.render(this.scene);
        };
        LetterAnim.prototype.play = function () {
            this.state = AnimState.PLAYING;
            this.clip.visible = true;
            if (this.clip.isLastFrame())
                this.clip.animation.playFromBeginToEnd();
            else
                this.clip.animation.playToEnd();
        };
        LetterAnim.prototype.pause = function () {
            this.state = AnimState.PAUSED;
            this.clip.visible = true;
            this.clip.animation.stop();
        };
        LetterAnim.prototype.stop = function () {
            this.state = AnimState.IDLE;
            this.clip.visible = false;
            this.clip.gotoFirstFrame();
            this.renderer.render(this.scene);
        };
        LetterAnim.prototype.getPointerPos = function () {
            for (var i in this.clip.children) {
                var child = this.clip.children[i];
                if (child.isFrameObject && child.resource.name == "pointer")
                    return this.scene.toLocal(child.position, this.clip);
            }
            return null;
        };
        return LetterAnim;
    }());
})(app || (app = {}));
var ArrayUtil;
(function (ArrayUtil) {
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var ti = Math.floor(Math.random() * i);
            var tv = array[i];
            array[i] = array[ti];
            array[ti] = tv;
        }
        return array;
    }
    ArrayUtil.shuffle = shuffle;
    function getRandomIndex(array) {
        return Math.floor(Math.random() * array.length);
    }
    ArrayUtil.getRandomIndex = getRandomIndex;
})(ArrayUtil || (ArrayUtil = {}));
var app;
(function (app) {
    var Ease = createjs.Ease;
    var CANVAS_REF_WIDTH = 1130;
    var CANVAS_REF_HEIGHT = 500;
    var CANVAS_PROP = CANVAS_REF_WIDTH / CANVAS_REF_HEIGHT;
    var MAX_BUF_WIDTH = 1920;
    function xComparer(a, b) {
        return a.x - b.x;
    }
    var WordGame = (function (_super) {
        __extends(WordGame, _super);
        function WordGame() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.letters = [];
            _this.placements = [];
            _this.draggedItem = null;
            _this.draggedOffset = new PIXI.Point;
            return _this;
        }
        WordGame.prototype.onInitialize = function () {
            var _this = this;
            var canvas = dom.get("canvas");
            var options = {
                view: canvas,
                transparent: false,
                backgroundColor: 0xFFFFFF,
                clearBeforeRender: true,
            };
            var renderer = new PIXI.CanvasRenderer(CANVAS_REF_WIDTH, CANVAS_REF_HEIGHT, options);
            this.scene = fl.Bundle.createClip(app.bundleId + "/scene");
            this.renderer = renderer;
            this.canvas = canvas;
            this.winAnim = this.scene.getElement("win_anim");
            this.winAnim.visible = false;
            this.initLetters();
            this.initPlacements();
            this.placementWidth = this.placements[1].sprite.x - this.placements[0].sprite.x;
            this.firstIndex = WordGame.FIRST_INDEX;
            this.shuffleCount = WordGame.SHUFFLE_COUNT;
            if (this.shuffleCount < 1)
                this.shuffleCount = 1;
            if (this.shuffleCount > this.letters.length)
                this.shuffleCount = this.letters.length;
            this.randomize(false);
            this.btnReplay = new app.HtmlButton(dom.get("btn_replay"), function () { return _this.onReplayClick(); });
            fl.onFrameLabel = function (t, l) { return _this.onFrameLabel(t, l); };
            sound.play("title");
        };
        WordGame.prototype.onResize = function () {
            var title = dom.getByClass("title");
            var buttons = dom.getByClass("buttons");
            var content = dom.get("content");
            var maxHeight = this.screenHeight - title.offsetHeight - buttons.offsetHeight;
            var maxWidth = content.offsetWidth;
            maxWidth = Math.max(maxWidth, 400);
            maxHeight = Math.max(maxHeight, 200);
            var workingWidth, workingHeight;
            if (maxWidth / maxHeight > CANVAS_PROP) {
                workingHeight = maxHeight;
                workingWidth = workingHeight * CANVAS_PROP;
            }
            else {
                workingWidth = maxWidth;
                workingHeight = workingWidth / CANVAS_PROP;
            }
            var canvas = this.canvas;
            canvas.style.width = workingWidth + "px";
            canvas.style.height = workingHeight + "px";
            content.style.marginTop = Math.floor(0.5 * (maxHeight - workingHeight)) + "px";
            var scale = Math.min(window.devicePixelRatio);
            var bufWidth = Math.min(Math.floor(workingWidth * scale), MAX_BUF_WIDTH);
            var bufHeight = Math.floor(bufWidth / CANVAS_PROP);
            this.renderer.resize(bufWidth, bufHeight);
            this.scene.scaleXY = bufWidth / CANVAS_REF_WIDTH;
        };
        WordGame.prototype.onUpdate = function () {
            if (this.draggedItem != null) {
                var localPos = this.scene.toLocal(this.draggedItem.mousePos);
                this.draggedItem.sprite.position.x = localPos.x - this.draggedOffset.x;
                this.draggedItem.sprite.position.y = localPos.y - this.draggedOffset.y;
            }
            this.renderer.render(this.scene);
        };
        WordGame.prototype.initLetters = function () {
            var _this = this;
            var children = this.scene.findByResource("letter_");
            children.sort(xComparer);
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var letter = new Letter(i, child);
                letter.onPress = function (it) { return _this.onLetterPress(it); };
                letter.onRelease = function () { return _this.onLetterRelease(); };
                this.letters.push(letter);
                this.freePosY = letter.sprite.y;
            }
        };
        WordGame.prototype.initPlacements = function () {
            var children = this.scene.findByResource("placement");
            children.sort(xComparer);
            for (var i = 0; i < children.length; i++) {
                var letter = this.letters[i];
                var placement = new Placement(i, children[i], letter.name);
                this.placements.push(placement);
            }
        };
        WordGame.prototype.onFrameLabel = function (target, label) {
            if (label.indexOf("s_") == 0)
                sound.play(label);
        };
        WordGame.prototype.onLetterPress = function (letter) {
            this.draggedItem = letter;
            this.draggedOffset = this.scene.toLocal(letter.mousePos);
            this.draggedOffset.x -= letter.sprite.position.x;
            this.draggedOffset.y -= letter.sprite.position.y;
            this.draggedItem.sprite.currentFrame = 1;
            this.scene.setChildIndex(this.draggedItem.sprite, this.scene.children.length - 1);
        };
        WordGame.prototype.onLetterRelease = function () {
            if (this.draggedItem == null)
                return;
            var letter = this.draggedItem;
            this.draggedItem.sprite.currentFrame = 0;
            this.draggedItem = null;
            var placement = this.tryGetNearestPlacement(letter.sprite.position);
            var isCorrect = placement
                && placement.isEmpty
                && placement.letterName == letter.name;
            if (isCorrect) {
                placement.isEmpty = false;
                letter.initialPos = placement.sprite.position.clone();
                letter.move(letter.initialPos, true);
                this.checkGameState();
            }
            else {
                letter.move(letter.initialPos, true);
            }
        };
        WordGame.prototype.tryGetNearestPlacement = function (pos) {
            for (var _i = 0, _a = this.placements; _i < _a.length; _i++) {
                var p = _a[_i];
                var dx = p.sprite.position.x - pos.x;
                var dy = p.sprite.position.y - pos.y;
                var r = Math.sqrt(dx * dx + dy * dy);
                if (r < 0.5 * this.placementWidth)
                    return p;
            }
            return null;
        };
        WordGame.prototype.checkGameState = function () {
            for (var _i = 0, _a = this.placements; _i < _a.length; _i++) {
                var placement = _a[_i];
                if (placement.isEmpty)
                    return;
            }
            sound.playRandom(['win1', 'win2', 'win3']);
            this.winAnim.visible = true;
            this.winAnim.animation.playFromBeginToEnd();
        };
        WordGame.prototype.onReplayClick = function () {
            this.randomize(true);
            this.winAnim.visible = false;
            this.winAnim.animation.gotoAndStop(0);
            sound.stop();
        };
        WordGame.prototype.randomize = function (animate) {
            var all = this.letters.slice();
            var free = [];
            if (this.firstIndex >= 0 && this.firstIndex < all.length) {
                free.push(all[this.firstIndex]);
                all.splice(this.firstIndex, 1);
                this.firstIndex = -1;
            }
            while (free.length < this.shuffleCount && all.length > 0) {
                var i = ArrayUtil.getRandomIndex(all);
                free.push(all[i]);
                all.splice(i, 1);
            }
            ArrayUtil.shuffle(free);
            for (var _i = 0, _a = this.letters; _i < _a.length; _i++) {
                var letter = _a[_i];
                var placement = this.placements[letter.index];
                placement.isEmpty = free.indexOf(letter) >= 0;
                if (!placement.isEmpty) {
                    letter.initialPos = placement.sprite.position.clone();
                    letter.move(placement.sprite.position, animate);
                    placement.isEmpty = false;
                }
            }
            var x1 = this.placements[0].sprite.x;
            var x2 = this.placements[this.placements.length - 1].sprite.x;
            var p = new PIXI.Point();
            p.x = Math.floor(0.5 * (x1 + x2) - 0.5 * (free.length - 1) * this.placementWidth);
            p.y = this.freePosY;
            for (var _b = 0, free_1 = free; _b < free_1.length; _b++) {
                var letter = free_1[_b];
                var placement = this.placements[letter.index];
                placement.isEmpty = true;
                letter.initialPos = p.clone();
                letter.move(p, animate);
                p.x += this.placementWidth;
            }
        };
        WordGame.SHUFFLE_COUNT = 2;
        WordGame.FIRST_INDEX = 0;
        return WordGame;
    }(app.GameBase));
    app.WordGame = WordGame;
    var Placement = (function () {
        function Placement(index, sprite, letterName) {
            this.index = index;
            this.sprite = sprite;
            this.letterName = letterName;
            this.isEmpty = false;
        }
        return Placement;
    }());
    var Letter = (function () {
        function Letter(index, sprite) {
            var _this = this;
            this.mousePos = new PIXI.Point();
            this.index = index;
            this.sprite = sprite;
            this.name = sprite.resource.name;
            this.initialPos = sprite.position.clone();
            sprite.interactive = true;
            sprite.buttonMode = true;
            sprite.on("mousedown", function (e) { return _this.handleMouse(e, _this.onPress); });
            sprite.on("mouseup", function (e) { return _this.handleMouse(e, _this.onRelease); });
            sprite.on("mouseupoutside", function (e) { return _this.handleMouse(e, _this.onRelease); });
            sprite.on("touchstart", function (e) { return _this.handleMouse(e, _this.onPress); });
            sprite.on("touchend", function (e) { return _this.handleMouse(e, _this.onRelease); });
            sprite.on("touchendoutside", function (e) { return _this.handleMouse(e, _this.onRelease); });
            sprite.on("mousemove", function (e) { return _this.handleMouse(e, null); });
            sprite.on("touchmove", function (e) { return _this.handleMouse(e, null); });
        }
        Letter.prototype.handleMouse = function (e, handler) {
            this.mousePos.copy(e.data.global);
            if (handler)
                handler(this);
        };
        Letter.prototype.move = function (pos, animate) {
            if (animate) {
                createjs.Tween.get(this.sprite)
                    .to({ x: pos.x, y: pos.y }, 250, Ease.quadOut);
            }
            else {
                this.sprite.position.copy(pos);
            }
        };
        return Letter;
    }());
})(app || (app = {}));
var app;
(function (app) {
    var CANVAS_REF_WIDTH = 1130;
    var CANVAS_REF_HEIGHT = 500;
    var CANVAS_PROP = CANVAS_REF_WIDTH / CANVAS_REF_HEIGHT;
    var MAX_BUF_WIDTH = 1920;
    var PuzzleGame = (function (_super) {
        __extends(PuzzleGame, _super);
        function PuzzleGame() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.POSITION_DELTA = 10;
            _this.parts = [];
            _this.positions = [];
            _this.draggedPart = null;
            _this.draggedOffset = new PIXI.Point;
            return _this;
        }
        PuzzleGame.prototype.onInitialize = function () {
            var _this = this;
            var canvas = dom.get("canvas");
            var options = {
                view: canvas,
                transparent: false,
                backgroundColor: 0xFFFFFF,
                clearBeforeRender: true,
            };
            var renderer = new PIXI.CanvasRenderer(CANVAS_REF_WIDTH, CANVAS_REF_HEIGHT, options);
            this.scene = fl.Bundle.createClip(app.bundleId + "/scene");
            this.renderer = renderer;
            this.canvas = canvas;
            this.winAnim = this.scene.getElement("win_anim");
            this.winAnim.visible = false;
            var posSprites = this.scene.findAllByPrefix("random_pos");
            for (var _i = 0, posSprites_1 = posSprites; _i < posSprites_1.length; _i++) {
                var sprite = posSprites_1[_i];
                this.positions.push(sprite.position.clone());
            }
            var partSprites = this.scene.findAllByPrefix("part_");
            for (var _a = 0, partSprites_1 = partSprites; _a < partSprites_1.length; _a++) {
                var sprite = partSprites_1[_a];
                var part = new PuzzlePart(sprite);
                part.onPress = function (it) { return _this.onPartPress(it); };
                part.onRelease = function (it) { return _this.onPartRelease(it); };
                this.parts.push(part);
            }
            this.randomazeParts(false);
            this.btnReplay = new app.HtmlButton(dom.get("btn_replay"), function () { return _this.onReplayClick(); });
            fl.onFrameLabel = function (t, l) { return _this.onFrameLabel(t, l); };
            sound.play("title");
        };
        PuzzleGame.prototype.onResize = function () {
            var title = dom.getByClass("title");
            var buttons = dom.getByClass("buttons");
            var content = dom.get("content");
            var maxHeight = this.screenHeight - title.offsetHeight - buttons.offsetHeight;
            var maxWidth = content.offsetWidth;
            maxWidth = Math.max(maxWidth, 400);
            maxHeight = Math.max(maxHeight, 200);
            var workingWidth, workingHeight;
            if (maxWidth / maxHeight > CANVAS_PROP) {
                workingHeight = maxHeight;
                workingWidth = workingHeight * CANVAS_PROP;
            }
            else {
                workingWidth = maxWidth;
                workingHeight = workingWidth / CANVAS_PROP;
            }
            var canvas = this.canvas;
            canvas.style.width = workingWidth + "px";
            canvas.style.height = workingHeight + "px";
            content.style.marginTop = Math.floor(0.5 * (maxHeight - workingHeight)) + "px";
            var scale = Math.min(window.devicePixelRatio);
            var bufWidth = Math.min(Math.floor(workingWidth * scale), MAX_BUF_WIDTH);
            var bufHeight = Math.floor(bufWidth / CANVAS_PROP);
            this.renderer.resize(bufWidth, bufHeight);
            this.scene.scaleXY = bufWidth / CANVAS_REF_WIDTH;
        };
        PuzzleGame.prototype.onUpdate = function () {
            if (this.draggedPart != null) {
                var localPos = this.scene.toLocal(this.draggedPart.mousePos);
                this.draggedPart.sprite.position.x = localPos.x - this.draggedOffset.x;
                this.draggedPart.sprite.position.y = localPos.y - this.draggedOffset.y;
            }
            this.renderer.render(this.scene);
        };
        PuzzleGame.prototype.onFrameLabel = function (target, label) {
            if (label.indexOf("s_") == 0)
                sound.play(label);
        };
        PuzzleGame.prototype.onPartPress = function (part) {
            this.draggedPart = part;
            this.draggedOffset = this.scene.toLocal(part.mousePos);
            this.draggedOffset.x -= part.sprite.position.x;
            this.draggedOffset.y -= part.sprite.position.y;
            this.draggedPart.sprite.currentFrame = 1;
            this.scene.setChildIndex(this.draggedPart.sprite, this.scene.children.length - 1);
        };
        PuzzleGame.prototype.onPartRelease = function (part) {
            if (this.draggedPart == part) {
                this.draggedPart.sprite.currentFrame = 0;
                this.draggedPart = null;
            }
            this.checkPartPositions();
        };
        PuzzleGame.prototype.checkPartPositions = function () {
            var maxDistance = 0;
            for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
                var part = _a[_i];
                var dx = part.initialPos.x - part.sprite.x;
                var dy = part.initialPos.y - part.sprite.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                maxDistance = Math.max(distance, maxDistance);
            }
            if (maxDistance < this.POSITION_DELTA) {
                for (var _b = 0, _c = this.parts; _b < _c.length; _b++) {
                    var part = _c[_b];
                    part.move(part.initialPos, true);
                }
                sound.playRandom(['win1', 'win2', 'win3']);
                this.winAnim.visible = true;
                this.winAnim.animation.playFromBeginToEnd();
            }
        };
        PuzzleGame.prototype.onReplayClick = function () {
            this.randomazeParts(true);
            this.winAnim.visible = false;
            this.winAnim.animation.gotoAndStop(0);
            sound.stop();
        };
        PuzzleGame.prototype.randomazeParts = function (animate) {
            ArrayUtil.shuffle(this.positions);
            for (var i = 0; i < this.parts.length; i++) {
                this.parts[i].move(this.positions[i], animate);
            }
        };
        return PuzzleGame;
    }(app.GameBase));
    app.PuzzleGame = PuzzleGame;
    var PuzzlePart = (function () {
        function PuzzlePart(sprite) {
            var _this = this;
            this.mousePos = new PIXI.Point();
            this.sprite = sprite;
            this.initialPos = sprite.position.clone();
            sprite.interactive = true;
            sprite.buttonMode = true;
            sprite.on("mousedown", function (e) { return _this.handleMouse(e, _this.onPress); });
            sprite.on("mouseup", function (e) { return _this.handleMouse(e, _this.onRelease); });
            sprite.on("mouseupoutside", function (e) { return _this.handleMouse(e, _this.onRelease); });
            sprite.on("touchstart", function (e) { return _this.handleMouse(e, _this.onPress); });
            sprite.on("touchend", function (e) { return _this.handleMouse(e, _this.onRelease); });
            sprite.on("touchendoutside", function (e) { return _this.handleMouse(e, _this.onRelease); });
            sprite.on("mousemove", function (e) { return _this.handleMouse(e, null); });
            sprite.on("touchmove", function (e) { return _this.handleMouse(e, null); });
        }
        PuzzlePart.prototype.handleMouse = function (e, handler) {
            this.mousePos.copy(e.data.global);
            if (handler)
                handler(this);
        };
        PuzzlePart.prototype.move = function (pos, animate) {
            if (animate) {
                createjs.Tween.get(this.sprite)
                    .to({ x: pos.x, y: pos.y }, 200);
            }
            else {
                this.sprite.position.copy(pos);
            }
        };
        return PuzzlePart;
    }());
})(app || (app = {}));
var app;
(function (app) {
    var refWidth;
    var refHeight;
    var MAX_BUF_WIDTH = 1920;
    var ColorGame = (function (_super) {
        __extends(ColorGame, _super);
        function ColorGame() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.positions = [];
            _this.buttons = [];
            _this.items = [];
            _this.lastSize = { width: -1, height: -1 };
            return _this;
        }
        ColorGame.prototype.onInitialize = function () {
            var _this = this;
            var canvas = dom.get("canvas");
            refWidth = canvas.width;
            refHeight = canvas.height;
            var options = {
                view: canvas,
                transparent: true,
                clearBeforeRender: true,
            };
            var renderer = new PIXI.CanvasRenderer(refWidth, refHeight, options);
            this.scene = fl.Bundle.createClip(app.bundleId + "/scene");
            this.renderer = renderer;
            this.canvas = canvas;
            this.winAnim = this.scene.getElement("win_anim");
            this.winAnim.visible = false;
            this.initColorButtons();
            this.initColorItems();
            this.randomaze(false);
            this.btnReplay = new app.HtmlButton(dom.get("btn_replay"), function () { return _this.onReplayClick(); });
            fl.onFrameLabel = function (t, l) { return _this.onFrameLabel(t, l); };
            sound.play("title");
            this.buttons.sort(function (a, b) { return a.name.localeCompare(b.name); });
            this.selectButton(this.buttons[0]);
        };
        ColorGame.prototype.onResize = function () {
        };
        ColorGame.prototype.onUpdate = function () {
            this.adjustCanvasSize();
            this.renderer.render(this.scene);
        };
        ColorGame.prototype.adjustCanvasSize = function () {
            var canvas = this.canvas;
            var last = this.lastSize;
            var w = canvas.offsetWidth;
            var h = canvas.offsetHeight;
            if (w !== last.width || h !== last.height) {
                console.log("resize: " + w + " " + h);
                var scale = Math.min(window.devicePixelRatio);
                var proportion = refHeight / refWidth;
                var bufWidth = Math.min(Math.floor(w * scale), MAX_BUF_WIDTH);
                var bufHeight = Math.floor(bufWidth * proportion);
                this.renderer.resize(bufWidth, bufHeight);
                this.scene.scaleXY = bufWidth / refWidth;
                last.width = canvas.offsetWidth;
                last.height = canvas.offsetHeight;
            }
        };
        ColorGame.prototype.initColorButtons = function () {
            var _this = this;
            this.buttons = this.scene.findAllByPrefix("btn_c");
            var _loop_2 = function () {
                var btn = this_2.buttons[i];
                btn.buttonMode = true;
                btn.interactive = true;
                btn.on("mousedown", function () { return _this.selectButton(btn); });
                btn.on("touchstart", function () { return _this.selectButton(btn); });
            };
            var this_2 = this;
            for (var i = 0; i < this.buttons.length; i++) {
                _loop_2();
            }
        };
        ColorGame.prototype.initColorItems = function () {
            var _this = this;
            var children = this.scene.findAllByPrefix("item_c");
            for (var i = 0; i < children.length; i++) {
                var item = new ColorItem(children[i]);
                item.pressHandler = function (it) { return _this.applyColor(it); };
                this.items.push(item);
                this.positions.push(item.sprite.position.clone());
            }
        };
        ColorGame.prototype.selectButton = function (btn) {
            if (this.selectedButton)
                this.selectedButton.currentFrame = 0;
            this.selectedButton = btn;
            this.selectedButton.currentFrame = 1;
        };
        ColorGame.prototype.applyColor = function (item) {
            item.fill(this.selectedButton);
            this.checkItemColors();
        };
        ColorGame.prototype.onFrameLabel = function (target, label) {
            if (label.indexOf("s_") == 0)
                sound.play(label);
        };
        ColorGame.prototype.checkItemColors = function () {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.expectedColor != item.actualColor)
                    return;
            }
            this.winAnim.visible = true;
            this.winAnim.animation.playFromBeginToEnd();
            sound.playRandom(['win1', 'win2', 'win3']);
        };
        ColorGame.prototype.onReplayClick = function () {
            this.randomaze(true);
            this.winAnim.animation.gotoAndStop(0);
            this.winAnim.visible = false;
            sound.stop();
        };
        ColorGame.prototype.randomaze = function (animate) {
            ArrayUtil.shuffle(this.positions);
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].move(this.positions[i], animate);
                this.items[i].reset();
            }
        };
        return ColorGame;
    }(app.GameBase));
    app.ColorGame = ColorGame;
    var ColorItem = (function () {
        function ColorItem(sprite) {
            this.sprite = sprite;
            this.expectedColor = sprite.name.split("_")[1];
            sprite.buttonMode = true;
            sprite.interactive = true;
            sprite.on("mousedown", this.handlePress, this);
            sprite.on("touchstart", this.handlePress, this);
        }
        ColorItem.prototype.handlePress = function () {
            if (this.pressHandler)
                this.pressHandler(this);
        };
        ColorItem.prototype.move = function (pos, animate) {
            if (animate) {
                createjs.Tween.get(this.sprite)
                    .to({ x: pos.x, y: pos.y }, 200);
            }
            else {
                this.sprite.position.copy(pos);
            }
        };
        ColorItem.prototype.reset = function () {
            this.actualColor = "";
            this.sprite.color.r = 1;
            this.sprite.color.g = 1;
            this.sprite.color.b = 1;
            this.sprite.color.a = 1;
        };
        ColorItem.prototype.fill = function (source) {
            var color = source.getChildByName("c_source").color;
            this.sprite.color.setFrom(color);
            this.actualColor = source.name.split("_")[1];
            if (this.expectedColor == this.actualColor)
                this.sprite.color.a = 1;
            else
                this.sprite.color.a = 0.5;
            createjs.Tween.get(this.sprite)
                .to({ scaleX: 1.1, scaleY: 1.1 }, 100)
                .to({ scaleX: 1.0, scaleY: 1.0 }, 100);
        };
        return ColorItem;
    }());
})(app || (app = {}));
var app;
(function (app) {
    app.GAME_WRITING = "writing";
    app.GAME_WORD = "word";
    app.GAME_PUZZLE = "puzzle";
    app.GAME_COLOR = "color";
    app.BASE_WIDTH = 1280;
    app.BASE_HEIGHT = 800;
    app.SOUND_ENABLED = false;
    app.DEBUG_LOG = false;
    var games = {};
    games[app.GAME_WRITING] = function () { return new app.WritingGame(); };
    games[app.GAME_WORD] = function () { return new app.WordGame(); };
    games[app.GAME_PUZZLE] = function () { return new app.PuzzleGame(); };
    games[app.GAME_COLOR] = function () { return new app.ColorGame(); };
    var _screen;
    var _windowWidth = -1;
    var _windowHeight = -1;
    function initialize(gameId) {
        app.bundleId = gameId;
        sound.enabled = app.SOUND_ENABLED;
        log.debugMode = app.DEBUG_LOG;
        log.trace(navigator.userAgent);
        fl.Bundle.version = "" + Math.round(Math.random() * 1e6);
        createjs.Ticker.framerate = 60;
        loadResources();
        requestAnimationFrame(update);
    }
    app.initialize = initialize;
    function loadResources() {
        fl.Bundle.load(app.bundleId, function () {
            document.body.style.visibility = 'visible';
            attachScreen();
        });
    }
    function attachScreen() {
        var factory = games[app.bundleId];
        if (!factory)
            throw "game constructor not found, bundleId: \"" + app.bundleId + "\")";
        _screen = factory();
        _screen.initialize();
        _screen.resize(_windowWidth, _windowHeight);
    }
    function update() {
        requestAnimationFrame(update);
        var width = window.innerWidth;
        var height = window.innerHeight;
        if (width != _windowWidth || height != _windowHeight) {
            _windowWidth = width;
            _windowHeight = height;
            console.log("resize:", width, height);
            if (_screen)
                _screen.resize(width, height);
        }
        if (_screen)
            _screen.update();
    }
})(app || (app = {}));
//# sourceMappingURL=/html-abetka/src/public/js/app.js.map