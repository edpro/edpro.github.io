var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            if (child instanceof PIXI.Container)
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
            _super.apply(this, arguments);
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
            _super.apply(this, arguments);
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
                Animation.signals[signal] = 1;
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
                this._target.stepForward();
                this._innerCond = undefined;
                this._innerJump = undefined;
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
            _super.call(this, id);
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
            var loader = new PIXI.loaders.Loader;
            var _loop_1 = function(textureName) {
                url = this_1.getUrl(textureName + Bundle.textureExt);
                this_1.verboseLog('loading: ' + url);
                loader.add(textureName, url, null, function () {
                    _this.textures[textureName] = loader.resources[textureName].texture;
                    _this.verboseLog("OK: " + textureName);
                });
            };
            var this_1 = this;
            var url;
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var textureName = names_1[_i];
                _loop_1(textureName);
            }
            loader.load(function () {
                _this.createResources();
                _this.complete();
            });
        };
        Bundle.prototype.complete = function () {
            this.rawData = null;
            if (this.completeHandler != null)
                this.completeHandler();
        };
        Bundle.prototype.createResources = function () {
            for (var _i = 0, _a = this.rawData['symbols']; _i < _a.length; _i++) {
                var symbol = _a[_i];
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
            _super.apply(this, arguments);
            this.timelineIndex = -1;
            this.labels = fl.Internal.EMPTY_ARRAY;
            this.color = new fl.Color(1, 1, 1, 1);
            this.isFlashObject = true;
            this.isFrameObject = false;
            this.scaleMultiplier = 1;
            this.globalColor = {};
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
            _super.call(this);
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
            _super.apply(this, arguments);
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
            _super.call(this, null);
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
            _super.apply(this, arguments);
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
            _super.apply(this, arguments);
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
            _super.call(this, text, style);
            this.timelineIndex = -1;
            this.color = new fl.Color(1, 1, 1, 1);
            this.isFlashObject = true;
            this.isFrameObject = false;
            this.scaleMultiplier = 1;
            this.isTextField = true;
            this._xCorrection = 0;
            this._yCorrection = 0;
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
    var AppScreen = (function () {
        function AppScreen(name) {
            this.name = "AppScreen";
            this._size = new PIXI.Point();
            this._anchors = [];
            this._bindings = {};
            this.name = name;
        }
        AppScreen.prototype.initialize = function () {
            this.onInitialize();
        };
        AppScreen.prototype.onInitialize = function () { };
        AppScreen.prototype.bindItem = function (prefix, action) {
            this._bindings[prefix] = action;
        };
        AppScreen.prototype.createButton = function (name, action) {
            return new fl.Button(this.content.getElement(name), action.bind(this));
        };
        AppScreen.prototype.configureBindings = function () {
            var _this = this;
            this.content.forEachRecursive(function (it) {
                if (_this.isInitialized(it))
                    return;
                else
                    _this.setInitialized(it);
                if (_this.applyBinding(it))
                    return;
            });
        };
        AppScreen.prototype.applyBinding = function (item) {
            if (!item.isFrameObject || !item.name)
                return false;
            for (var key in this._bindings) {
                if (item.name.indexOf(key) == 0) {
                    this._bindings[key](item);
                    return true;
                }
            }
            return false;
        };
        AppScreen.prototype.createContent = function (path) {
            this.content = fl.Bundle.createClip(path);
            this._size.x = app.WIDTH;
            this._size.y = app.HEIGHT;
            this._reserve = Math.abs(this.content.getChildAt(0).x);
            this.configureLayout();
            this.configureContent();
        };
        AppScreen.prototype.configureContent = function () {
            this.configureBindings();
            this.configureAutoPlay(this.content);
        };
        AppScreen.prototype.configureLayout = function () {
            this.resetLayout();
            this.configureAnchors();
            this.restoreLayout();
        };
        AppScreen.prototype.configureAutoPlay = function (container) {
            var _this = this;
            container.children.forEach(function (it) {
                var frameObj = it;
                if (!frameObj.name && frameObj.totalFrames > 1)
                    frameObj.animation.play();
                else if (it instanceof fl.Container)
                    _this.configureAutoPlay(it);
            });
        };
        AppScreen.prototype.configureAnchors = function () {
            var _this = this;
            this._anchors = [];
            var leftGuid = this.content.getChildByName("guid_left");
            var left = leftGuid ? leftGuid.x : Number.MIN_VALUE;
            if (leftGuid)
                leftGuid.visible = false;
            var rightGuid = this.content.getChildByName("guid_right");
            var right = rightGuid ? rightGuid.x : Number.MAX_VALUE;
            if (rightGuid)
                rightGuid.visible = false;
            var ignores = ["back", "model", "guid"];
            this.content.children.forEach(function (it) {
                if (it.name) {
                    for (var _i = 0, ignores_1 = ignores; _i < ignores_1.length; _i++) {
                        var ignore = ignores_1[_i];
                        if (it.name.indexOf(ignore) == 0)
                            return;
                    }
                }
                if (it.x <= left)
                    _this.addAnchor(_this, "contentLeft", it, "x");
                else if (it.x >= right)
                    _this.addAnchor(_this, "contentRight", it, "x");
            });
        };
        AppScreen.prototype.addAnchor = function (source, sourceProp, target, targetProp, multiplier) {
            if (multiplier === void 0) { multiplier = 1.0; }
            this._anchors.push(new fl.Anchor(source, sourceProp, target, targetProp, multiplier));
        };
        AppScreen.prototype.resetLayout = function () {
            this._savedWidth = this._size.x;
            this._savedHeight = this._size.y;
            this._size.x = app.WIDTH;
            this._size.y = app.HEIGHT;
            this.content.position.x = 0;
            this.content.position.y = 0;
            this.content.scale.y = 1;
            this.content.scale.x = 1;
        };
        AppScreen.prototype.restoreLayout = function () {
            this._size.x = this._savedWidth;
            this._size.y = this._savedHeight;
            this.validateLayout();
        };
        AppScreen.prototype.validateLayout = function () {
            var scaleY = this.height / app.HEIGHT;
            var scaleX = this.width / app.WIDTH;
            var scale = Math.min(scaleX, scaleY);
            this.content.scale.x = scale;
            this.content.scale.y = scale;
            this.content.x = 0.5 * (this.width - app.WIDTH * scale);
            for (var _i = 0, _a = this._anchors; _i < _a.length; _i++) {
                var a = _a[_i];
                a.apply();
            }
            this.onLayoutChanged();
        };
        AppScreen.prototype.onLayoutChanged = function () {
        };
        ;
        Object.defineProperty(AppScreen.prototype, "contentLeft", {
            get: function () {
                var left = (-this.content.x) / this.content.scale.x;
                return Math.max(-this._reserve, left);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppScreen.prototype, "contentRight", {
            get: function () {
                var right = (this.width - this.content.x) / this.content.scale.x;
                return Math.min(right, app.WIDTH + this._reserve);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppScreen.prototype, "width", {
            get: function () {
                return this._size.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppScreen.prototype, "height", {
            get: function () {
                return this._size.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppScreen.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        AppScreen.prototype.resize = function (x, y) {
            this._size.x = x;
            this._size.y = y;
            this.validateLayout();
        };
        AppScreen.prototype.isInitialized = function (item) {
            return item.hasOwnProperty("__INITIALIZED__");
        };
        AppScreen.prototype.setInitialized = function (item) {
            item["__INITIALIZED__"] = true;
        };
        return AppScreen;
    }());
    app.AppScreen = AppScreen;
})(app || (app = {}));
var app;
(function (app) {
    var CLIP_NAME = "pointer";
    var WritingGame = (function (_super) {
        __extends(WritingGame, _super);
        function WritingGame() {
            _super.call(this, "WritingGame");
            this.isDrawing = false;
        }
        WritingGame.prototype.onInitialize = function () {
            var _this = this;
            this.createContent(app.BUNDLE_ID + "/scene");
            this.anim = new LetterAnim(this.content);
            this.canvas = new DrawCanvas(this.content);
            this.canvas.onPress = function () { return _this.onCanvasPress(); };
            this.canvas.onRelease = function () { return _this.onCanvasRelease(); };
            this.btnPlay = this.createButton("btn_play", this.onPlayClick);
            this.btnStop = this.createButton("btn_stop", this.onStopClick);
            this.btnPause = this.createButton("btn_pause", this.onPauseClick);
            this.refresh();
            PIXI.ticker.shared.add(this.onTickEvent, this);
            fl.onFrameLabel = function (t, l) { return _this.onFrameLabel(t, l); };
            app.playSound("title");
        };
        WritingGame.prototype.onFrameLabel = function (target, label) {
            if (label.indexOf("s_") == 0)
                app.playSound(label);
        };
        WritingGame.prototype.onPlayClick = function () {
            if (this.anim.state == AnimState.COMPLETED || this.anim.state == AnimState.IDLE) {
                this.anim.stop();
                this.canvas.clear();
            }
            this.anim.play();
            this.refresh();
        };
        WritingGame.prototype.onStopClick = function () {
            app.stopSound();
            this.canvas.clear();
            this.anim.stop();
            this.refresh();
        };
        WritingGame.prototype.onPauseClick = function () {
            app.stopSound();
            this.anim.pause();
            this.refresh();
        };
        WritingGame.prototype.refresh = function () {
            this.btnPlay.content.visible = this.anim.state != AnimState.PLAYING;
            this.btnPause.content.visible = this.anim.state == AnimState.PLAYING;
        };
        WritingGame.prototype.onTickEvent = function () {
            if (this.anim.state == AnimState.PLAYING)
                this.updateAnim();
            else if (this.isDrawing)
                this.updateDrawing();
            this.refresh();
        };
        WritingGame.prototype.updateAnim = function () {
            var p = this.anim.getPointerGlobalPos();
            if (p == null)
                this.canvas.endLine();
            else
                this.canvas.drawLine(p, 6);
        };
        WritingGame.prototype.updateDrawing = function () {
            this.canvas.drawLine(this.canvas.mousePos, 10);
        };
        WritingGame.prototype.onCanvasPress = function () {
            if (this.anim.state == AnimState.IDLE)
                this.isDrawing = true;
        };
        WritingGame.prototype.onCanvasRelease = function () {
            this.canvas.endLine();
            this.isDrawing = false;
        };
        return WritingGame;
    }(app.AppScreen));
    app.WritingGame = WritingGame;
    var DrawCanvas = (function () {
        function DrawCanvas(content) {
            var _this = this;
            this.mousePos = new PIXI.Point();
            this.dpiScale = 1;
            this.linePoint = new PIXI.Point();
            this.linePointSet = false;
            this.dpiScale = Math.max(window.devicePixelRatio, 2);
            this.canvas = document.createElement('canvas');
            this.rect = content.getElement("draw_rect");
            this.canvas.width = this.rect.width * this.dpiScale;
            this.canvas.height = this.rect.height * this.dpiScale;
            var texture = PIXI.Texture.fromCanvas(this.canvas);
            this.sprite = new PIXI.Sprite(texture);
            this.sprite.scale.x = 1.0 / this.dpiScale;
            this.sprite.scale.y = 1.0 / this.dpiScale;
            this.sprite.x = this.rect.x;
            this.sprite.y = this.rect.y;
            content.addChild(this.sprite);
            this.sprite.interactive = true;
            this.sprite.on("mousedown", function (e) { return _this.handleMouse(e, _this.onPress); });
            this.sprite.on("mouseup", function (e) { return _this.handleMouse(e, _this.onRelease); });
            this.sprite.on("mouseupoutside", function (e) { return _this.handleMouse(e, _this.onRelease); });
            this.sprite.on("touchstart", function (e) { return _this.handleMouse(e, _this.onPress); });
            this.sprite.on("touchend", function (e) { return _this.handleMouse(e, _this.onRelease); });
            this.sprite.on("touchendoutside", function (e) { return _this.handleMouse(e, _this.onRelease); });
            this.sprite.on("mousemove", function (e) { return _this.handleMouse(e, null); });
            this.sprite.on("touchmove", function (e) { return _this.handleMouse(e, null); });
        }
        DrawCanvas.prototype.endLine = function () {
            this.linePointSet = false;
        };
        DrawCanvas.prototype.drawLine = function (globalPos, lineWidth) {
            var c = this.getContext();
            var prevPos = this.linePoint;
            var nextPos = this.sprite.toLocal(globalPos);
            c.lineCap = 'round';
            c.strokeStyle = "#5200ff";
            c.lineWidth = lineWidth * this.dpiScale;
            if (this.linePointSet) {
                c.beginPath();
                c.moveTo(prevPos.x, prevPos.y);
                c.lineTo(nextPos.x, nextPos.y);
                c.stroke();
                prevPos.copy(nextPos);
            }
            else {
                this.linePointSet = true;
                prevPos.copy(nextPos);
            }
        };
        DrawCanvas.prototype.clear = function () {
            this.getContext()
                .clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.linePointSet = false;
        };
        DrawCanvas.prototype.getContext = function () {
            return this.canvas.getContext('2d');
        };
        DrawCanvas.prototype.handleMouse = function (e, handler) {
            this.mousePos.copy(e.data.global);
            if (handler)
                handler();
        };
        return DrawCanvas;
    }());
    var AnimState;
    (function (AnimState) {
        AnimState[AnimState["IDLE"] = 0] = "IDLE";
        AnimState[AnimState["PLAYING"] = 1] = "PLAYING";
        AnimState[AnimState["PAUSED"] = 2] = "PAUSED";
        AnimState[AnimState["COMPLETED"] = 3] = "COMPLETED";
    })(AnimState || (AnimState = {}));
    var LetterAnim = (function () {
        function LetterAnim(content) {
            var _this = this;
            this._state = AnimState.IDLE;
            this._clip = content.getElement(CLIP_NAME);
            this._clip.animation.onComplete(function () { return _this._state = AnimState.COMPLETED; });
            this._clip.visible = false;
        }
        LetterAnim.prototype.play = function () {
            this._state = AnimState.PLAYING;
            this._clip.visible = true;
            if (this._clip.isLastFrame())
                this._clip.animation.playFromBeginToEnd();
            else
                this._clip.animation.playToEnd();
        };
        LetterAnim.prototype.pause = function () {
            this._state = AnimState.PAUSED;
            this._clip.visible = true;
            this._clip.animation.stop();
        };
        LetterAnim.prototype.stop = function () {
            this._state = AnimState.IDLE;
            this._clip.visible = false;
            this._clip.gotoFirstFrame();
        };
        LetterAnim.prototype.getPointerGlobalPos = function () {
            return this._clip.children.length > 0
                ? this._clip.toGlobal(this._clip.children[0].position)
                : null;
        };
        Object.defineProperty(LetterAnim.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        return LetterAnim;
    }());
})(app || (app = {}));
var app;
(function (app) {
    app.WIDTH = 800;
    app.HEIGHT = 600;
    app.BUNDLE_ID = "bundle_id_not_set";
    app.STAGE_COLOR = 0xFFFFFF;
    app.FORCE_USE_CANVAS = true;
    app.SOUND_ENABLED = true;
    var _renderer;
    var _stage;
    var _container;
    var _screen;
    function initialize(elementOrId) {
        console.log("STAGE_COLOR: " + app.STAGE_COLOR);
        console.log("FORCE_USE_CANVAS: " + app.FORCE_USE_CANVAS);
        var container = (typeof elementOrId === "string")
            ? document.getElementById(elementOrId)
            : elementOrId;
        _container = container || document.body;
        fl.Bundle.version = "" + Math.round(Math.random() * 1e6);
        initRenderer();
        validateLayout();
        loadGameScreen();
        requestAnimationFrame(render);
    }
    app.initialize = initialize;
    function initRenderer() {
        _stage = new PIXI.Container();
        _renderer = app.FORCE_USE_CANVAS
            ? new PIXI.CanvasRenderer(app.WIDTH, app.HEIGHT)
            : PIXI.autoDetectRenderer(app.WIDTH, app.HEIGHT);
        _renderer.transparent = false;
        _renderer.backgroundColor = app.STAGE_COLOR;
        _renderer.clearBeforeRender = true;
        _renderer.render(_stage);
        setTimeout(function () { return _container.appendChild(_renderer.view); });
    }
    function loadGameScreen() {
        fl.Bundle.load(app.BUNDLE_ID, function () {
            if (app.BUNDLE_ID.indexOf("write_") == 0)
                changeScreen(new app.WritingGame());
            else
                throw ("Cannot determine game type: " + app.BUNDLE_ID);
        });
    }
    function changeScreen(screen) {
        console.log("App.changeScreen: " + screen.name);
        if (!_screen) {
            attachScreen(screen);
        }
        else {
            _screen.content.cacheAsBitmap = true;
            beginTransition(function () {
                _stage.removeChild(_screen.content);
                attachScreen(screen);
            });
        }
    }
    function attachScreen(screen) {
        screen.initialize();
        _screen = screen;
        _stage.addChildAt(_screen.content, 0);
        adjustScreenSize();
    }
    function adjustScreenSize() {
        if (_screen)
            _screen.resize(_renderer.width, _renderer.height);
    }
    function render() {
        requestAnimationFrame(render);
        validateLayout();
        _renderer.render(_stage);
    }
    var _prevWidth = -1;
    var _prevHeight = -1;
    function validateLayout() {
        var w0 = window.innerWidth;
        var h0 = window.innerHeight;
        if (w0 == _prevWidth && h0 == _prevHeight)
            return;
        _prevWidth = w0;
        _prevHeight = h0;
        var appPropMin = app.WIDTH / app.HEIGHT;
        var appPropMax = app.WIDTH / app.HEIGHT;
        var canvasWidth;
        var canvasHeight;
        var canvasMinWidth = h0 * appPropMin;
        var canvasMaxWidth = h0 * appPropMax;
        if (w0 < canvasMinWidth) {
            canvasWidth = w0;
            canvasHeight = w0 / appPropMin;
        }
        else if (w0 > canvasMaxWidth) {
            canvasWidth = canvasMaxWidth;
            canvasHeight = h0;
        }
        else {
            canvasWidth = w0;
            canvasHeight = h0;
        }
        canvasWidth = Math.floor(canvasWidth);
        canvasHeight = Math.floor(canvasHeight);
        var canvasX = Math.round(0.5 * (w0 - canvasWidth));
        var canvasY = Math.round(0.5 * (h0 - canvasHeight));
        var canvas = _renderer.view;
        canvas.style.marginLeft = canvasX + "px";
        canvas.style.marginTop = canvasY + "px";
        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";
        adjustResolution(canvasWidth, canvasHeight);
        adjustScreenSize();
    }
    function adjustResolution(width, height) {
        var max_w = 2048;
        var max_h = 1536;
        var res = window.devicePixelRatio;
        var w = width * res;
        var h = height * res;
        var k = Math.max(w / max_w, h / max_h);
        if (k > 1) {
            w /= k;
            h /= k;
        }
        _renderer.resize(w, h);
    }
    function beginTransition(action) {
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(0, 0, _renderer.width, _renderer.height);
        _stage.addChild(graphics);
        graphics.alpha = 0;
        graphics.cacheAsBitmap = true;
        graphics.interactive = true;
        createjs.Tween.get(graphics)
            .to({ alpha: 1 }, 250)
            .call(function () { return action(); })
            .to({ alpha: 0 }, 250)
            .call(function () { return _stage.removeChild(graphics); });
    }
    function gotoFullScreen() {
        var el = _renderer.view;
        if (el.webkitRequestFullScreen)
            el.webkitRequestFullScreen();
        else if (el.mozRequestFullScreen)
            el.mozRequestFullScreen();
    }
    app.gotoFullScreen = gotoFullScreen;
    function exitFullScreen() {
        var doc = document;
        if (doc.webkitCancelFullScreen)
            doc.webkitCancelFullScreen();
        else if (doc.mozCancelFullScreen)
            doc.mozCancelFullScreen();
    }
    app.exitFullScreen = exitFullScreen;
    function getRenderer() {
        return _renderer;
    }
    app.getRenderer = getRenderer;
    var _currentSound = null;
    var _currentSoundName = null;
    function playSound(name) {
        console.log("sound: " + name);
        if (!app.SOUND_ENABLED)
            return;
        stopSound();
        var url = "snd/" + name + ".mp3";
        _currentSoundName = name;
        _currentSound = new Howl({
            urls: [url],
            autoplay: true,
            loop: false,
            volume: 1.0,
        });
    }
    app.playSound = playSound;
    function stopSound() {
        if (!app.SOUND_ENABLED)
            return;
        _currentSoundName = name;
        if (_currentSound) {
            var sound = _currentSound;
            sound.fade(sound.volume(), 0, 500, function () { return sound.unload(); });
            _currentSound = null;
        }
    }
    app.stopSound = stopSound;
})(app || (app = {}));
//# sourceMappingURL=app.js.map