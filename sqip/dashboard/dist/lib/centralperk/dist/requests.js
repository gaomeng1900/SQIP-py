
/*
@author Meng G. <gaomeng1900@gmail.com>
@date 2016-03-19
@github https://github.com/gaomeng1900/requests.git
@ref XHR 2 ducoment: https://xhr.spec.whatwg.org/

A pack of useful ajax methods, 
including:
    GET
    POST (form/file)
    PUT (form/file)
    DELETE
    ** single file upload **

Support ADM/commonJS/global

@example:
    new Requests({
        url: 'http://server.com:9040?uid=admin&token=qwer#jiajiajia',
        params: {
            name: 'wahaha',
            file:ele.files[0]
        },
        load:function(args){
            console.warn('MY LOAD HANDLER: ', args)
        },
        progress:function(args){
            console.warn('MY progress HANDLER: ', args)
        }
    }).post()

    or:

    new Requests('http://server.com:9040?uid=admin&token=qwer#jiajiajia').post()
        .load(function(args) { console.log(args) })
        .error(function(args){ console.error(args) });

@class Requests
@constructor
    @param opt {Object} init params
        @key url {String}
        @key [params] {Object} k-v s in this will be mixed into the url (immediately when constructing)
        @key [form] {Object} k-v s in this will be mixed into the formData (if you use GET/DELETE, this will be ignored)
        @key [fileKey] {String} the form key of the file in form, default "file"
 */
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    return module.exports = factory();
  } else {
    if (typeof define === 'function' && define.amd) {
      return define(factory);
    } else {
      return global.Requests = factory();
    }
  }
})(this, function() {
  var Requests, __DEBUG_REQUESTS;
  __DEBUG_REQUESTS = false;
  return Requests = (function() {
    function Requests(cus_opt) {
      this.abort = bind(this.abort, this);
      this.progress = bind(this.progress, this);
      this.error = bind(this.error, this);
      this.load = bind(this.load, this);
      this._mixURL = bind(this._mixURL, this);
      this._extend = bind(this._extend, this);
      this._xhrOnabort = bind(this._xhrOnabort, this);
      this._xhrOnerror = bind(this._xhrOnerror, this);
      this._xhrOnloadend = bind(this._xhrOnloadend, this);
      this._updateProgress = bind(this._updateProgress, this);
      this.upload = bind(this.upload, this);
      if (!cus_opt || (typeof cus_opt === 'object' && !cus_opt.url)) {
        throw new Error('url is needed!!');
      }
      this.opt = {};
      this.opt.url = cus_opt.url || cus_opt;
      this.opt.params = cus_opt.params || {};
      this.opt.url = this._mixURL(this.opt.url, this.opt.params);
      this.opt.form = cus_opt.form || {};
      this.opt.fileKey = cus_opt.fileKey || 'file';
      this.cus_opt = cus_opt;
    }


    /*
    Use this method to upload a file directly.
    @example:
        html:
            <input type="file" onchange="upfile(this)">
        js:
            function upfile(ele) {
                new Requests({
                    url: 'http://server.com:9040?uid=admin&token=qwer#jiajiajia',
                    params: {
                        name: 'wahaha'
                    },
                    load:function(args){
                        console.warn('MY LOAD HANDLER: ', args)
                    },
                    progress:function(args){
                        console.warn('MY progress HANDLER: ', args)
                    }
                }).upload(ele.files[0]);
            };
        or:
            function upfile2(ele) {
                new Requests('http://server.com:9040?uid=admin&token=qwer#jiajiajia')
                    .upload(ele.files[0]);
            };
    
    @method upload
    @param fileObj {File} file you want to upload
    @return undefined
     */

    Requests.prototype.upload = function(fileObj) {
      this.opt.form[this.opt.fileKey] = fileObj;
      this._http('post');
      return this;
    };


    /*
    These four methods are for handler calling.
    They will execute the default handler and then call your handlers \
    (seted in the constructor or Method chaining).
    Your customer callback args will be mixed into the param of callback calling, \
    and a warning will be raised if there is a key conflict
    
    ** You shouldn't use this unless it's for debug **
    
    @method load/error/progress/abort
    @param handler {Function} 
    @return this {Requests}
     */

    Requests.prototype._updateProgress = function(e) {
      if (e.lengthComputable) {
        this.opt.uploadPercent = e.loaded / e.total;
      }
      if (this.cus_opt.progress) {
        return this.cus_opt.progress(this._extend({
          progress: this.opt.uploadPercent
        }, this.cus_opt.progress_arg));
      }
    };

    Requests.prototype._xhrOnloadend = function(e) {
      var error, response;
      if (this.xhr.status > 399) {
        console.warn('xhr failed');
        this._xhrOnerror(e);
        return;
      }
      try {
        response = JSON.parse(this.xhr.response);
      } catch (error) {
        e = error;
        console.error('not json!!');
        response = this.xhr.response;
      }
      if (__DEBUG_REQUESTS) {
        console.log('Onload: this: ', this.xhr);
        console.log(response);
      }
      if (this.cus_opt.load) {
        return this.cus_opt.load(this._extend(this.cus_opt.load_arg, response));
      }
    };

    Requests.prototype._xhrOnerror = function(e) {
      var __response, error;
      console.error('XHR FAILED', this.xhr);
      try {
        __response = this.xhr.response ? JSON.parse(this.xhr.response) : {};
      } catch (error) {
        e = error;
        __response = this.xhr.response;
      }
      if (this.cus_opt.error) {
        return this.cus_opt.error(this._extend(this.cus_opt.error_arg, __response));
      } else {
        throw new Error('XHR FAILED');
      }
    };

    Requests.prototype._xhrOnabort = function(e) {
      console.error('XHR ABORT');
      if (this.cus_opt.abort) {
        return this.cus_opt.abort(this.cus_opt.abort_arg);
      }
    };


    /*
    Just like jQuery.extend, mix tow or more object
    ** Shallow copy ** 
    
    @method _extend
    @param ... {Object} 
    @return undefined
     */

    Requests.prototype._extend = function() {
      var __id, i, k, len, new_obj, obj, v;
      __id = 0;
      new_obj = {};
      for (i = 0, len = arguments.length; i < len; i++) {
        obj = arguments[i];
        if (typeof obj === 'string') {
          console.error('cannot extend string!!');
          new_obj['__string_' + __id] = obj;
          __id += 1;
        } else {
          for (k in obj) {
            v = obj[k];
            if (new_obj[k]) {
              console.warn('extend conflict: ', obj, k);
            }
            new_obj[k] = v;
          }
        }
      }
      return new_obj;
    };


    /*
    Add params into queryString of URL.
    ** This won't check if the key is already in the queryString **
    
    @method _mixURL
    @param url {String} 
    @param params {Object} 
    @return undefined
     */

    Requests.prototype._mixURL = function(url, params) {
      var __index_hash, __index_query, k, param_str, v;
      if (params.length !== 0) {
        param_str = '';
        for (k in params) {
          v = params[k];
          param_str += k.toString() + '=' + v.toString() + '&';
        }
        __index_query = url.indexOf('?');
        __index_hash = url.indexOf('#');
        if (__index_query < 0 && __index_hash < 0) {
          return url + '?' + param_str.slice(0, param_str.length - 1);
        }
        if (__index_query < 0 && __index_hash >= 0) {
          return (url.slice(0, __index_hash)) + '?' + (param_str.slice(0, param_str.length - 1)) + (url.slice(__index_hash));
        }
        if (__index_query >= 0 && __index_hash < 0) {
          return (url.slice(0, __index_query + 1)) + param_str + (url.slice(__index_query + 1));
        }
        if (__index_query >= 0 && __index_hash >= 0) {
          return (url.slice(0, __index_query + 1)) + param_str + (url.slice(__index_query + 1));
        }
      } else {
        return url;
      }
    };


    /*
    Method that handel all the XHR
    ** you shouldn't use this unless it's for debug **
    
    @method _http
    @param method {String} [get|post|put|delete]  ** case-insensitive **
    @return undefined
     */

    Requests.prototype._http = function(method) {
      var e, error, formData, k, ref, v;
      this.xhr = new XMLHttpRequest();
      this.xhr.upload.addEventListener("progress", this._updateProgress, false);
      this.xhr.addEventListener("loadend", this._xhrOnloadend, false);
      this.xhr.addEventListener("abort", this._xhrOnabort, false);
      this.xhr.open(method, this.opt.url);
      if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
        try {
          formData = new FormData();
        } catch (error) {
          e = error;
          throw new Error('your browser is out dated (formData not supported)');
        }
        if (this.opt.form) {
          ref = this.opt.form;
          for (k in ref) {
            v = ref[k];
            formData.append(k, v);
          }
        }
        return this.xhr.send(formData);
      } else {
        return this.xhr.send();
      }
    };


    /*
    @example:
    new Requests({
        url: 'http://server.com:9040?uid =admin&token=qwer',
        params: {ssid:"piupiupi"},
        error: function(args){console.warn('MY ERROR HANDLER: ', args)},
        load: function(args){console.warn('MY LOAD HANDLER: ', args)}
    }).get()
    @method get
    @return undefined
     */

    Requests.prototype.get = function() {
      this._http('get');
      return this;
    };


    /*
    @example:
        new Requests({
            url: 'http://server.com:9040?uid=admin&token=qwer',
            form:{
                ha:"hahahha",
                hei:'heihie',
                file:ele.files[0]
            },
            error:function(args){
                console.warn('MY ERROR HANDLER: ', args)
            },
            load:function(args){
                console.warn('MY LOAD HANDLER: ', args)
            },
            progress:function(args){
                console.warn('MY progress HANDLER: ', args)
            }
        }).post();
    @method post
    @return undefined
     */

    Requests.prototype.post = function() {
      this._http('post');
      return this;
    };


    /*
    @method put
    @return undefined
     */

    Requests.prototype.put = function() {
      this._http('put');
      return this;
    };


    /*
    @method delete
    @return undefined
     */

    Requests.prototype["delete"] = function() {
      this._http('delete');
      return this;
    };


    /*
    These four methods are for ** Method chaining **
    ** These will cover the functions you set in the constructor opt **
    
    @method load/error/progress/abort
    @param handler {Function} 
    @return this {Requests}
     */

    Requests.prototype.load = function(load_handler) {
      this.cus_opt.load = load_handler;
      return this;
    };

    Requests.prototype.error = function(error_handler) {
      this.cus_opt.error = error_handler;
      return this;
    };

    Requests.prototype.progress = function(progress_handler) {
      this.cus_opt.progress = progress_handler;
      return this;
    };

    Requests.prototype.abort = function(abort_handler) {
      this.cus_opt.abort = abort_handler;
      return this;
    };

    return Requests;

  })();
});

//# sourceMappingURL=data:application/json;base64,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QUFNLFNBQUMsWUFBRDtNQUNGLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxHQUFnQjtBQUNoQixhQUFPO0lBRkw7O3VCQUtOLEtBQUEsR0FBTyxTQUFDLGFBQUQ7TUFDSCxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVQsR0FBaUI7QUFDakIsYUFBTztJQUZKOzt1QkFLUCxRQUFBLEdBQVUsU0FBQyxnQkFBRDtNQUNOLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxHQUFvQjtBQUNwQixhQUFPO0lBRkQ7O3VCQUtWLEtBQUEsR0FBTyxTQUFDLGFBQUQ7TUFDSCxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVQsR0FBaUI7QUFDakIsYUFBTztJQUZKOzs7OztBQTNSUCxDQVBSIiwiZmlsZSI6InJlcXVlc3RzLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5AYXV0aG9yIE1lbmcgRy4gPGdhb21lbmcxOTAwQGdtYWlsLmNvbT5cbkBkYXRlIDIwMTYtMDMtMTlcbkBnaXRodWIgaHR0cHM6Ly9naXRodWIuY29tL2dhb21lbmcxOTAwL3JlcXVlc3RzLmdpdFxuQHJlZiBYSFIgMiBkdWNvbWVudDogaHR0cHM6Ly94aHIuc3BlYy53aGF0d2cub3JnL1xuXG5BIHBhY2sgb2YgdXNlZnVsIGFqYXggbWV0aG9kcywgXG5pbmNsdWRpbmc6XG4gICAgR0VUXG4gICAgUE9TVCAoZm9ybS9maWxlKVxuICAgIFBVVCAoZm9ybS9maWxlKVxuICAgIERFTEVURVxuICAgICoqIHNpbmdsZSBmaWxlIHVwbG9hZCAqKlxuXG5TdXBwb3J0IEFETS9jb21tb25KUy9nbG9iYWxcblxuQGV4YW1wbGU6XG4gICAgbmV3IFJlcXVlc3RzKHtcbiAgICAgICAgdXJsOiAnaHR0cDovL3NlcnZlci5jb206OTA0MD91aWQ9YWRtaW4mdG9rZW49cXdlciNqaWFqaWFqaWEnLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIG5hbWU6ICd3YWhhaGEnLFxuICAgICAgICAgICAgZmlsZTplbGUuZmlsZXNbMF1cbiAgICAgICAgfSxcbiAgICAgICAgbG9hZDpmdW5jdGlvbihhcmdzKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignTVkgTE9BRCBIQU5ETEVSOiAnLCBhcmdzKVxuICAgICAgICB9LFxuICAgICAgICBwcm9ncmVzczpmdW5jdGlvbihhcmdzKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignTVkgcHJvZ3Jlc3MgSEFORExFUjogJywgYXJncylcbiAgICAgICAgfVxuICAgIH0pLnBvc3QoKVxuXG4gICAgb3I6XG5cbiAgICBuZXcgUmVxdWVzdHMoJ2h0dHA6Ly9zZXJ2ZXIuY29tOjkwNDA/dWlkPWFkbWluJnRva2VuPXF3ZXIjamlhamlhamlhJykucG9zdCgpXG4gICAgICAgIC5sb2FkKGZ1bmN0aW9uKGFyZ3MpIHsgY29uc29sZS5sb2coYXJncykgfSlcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGFyZ3MpeyBjb25zb2xlLmVycm9yKGFyZ3MpIH0pO1xuXG5AY2xhc3MgUmVxdWVzdHNcbkBjb25zdHJ1Y3RvclxuICAgIEBwYXJhbSBvcHQge09iamVjdH0gaW5pdCBwYXJhbXNcbiAgICAgICAgQGtleSB1cmwge1N0cmluZ31cbiAgICAgICAgQGtleSBbcGFyYW1zXSB7T2JqZWN0fSBrLXYgcyBpbiB0aGlzIHdpbGwgYmUgbWl4ZWQgaW50byB0aGUgdXJsIChpbW1lZGlhdGVseSB3aGVuIGNvbnN0cnVjdGluZylcbiAgICAgICAgQGtleSBbZm9ybV0ge09iamVjdH0gay12IHMgaW4gdGhpcyB3aWxsIGJlIG1peGVkIGludG8gdGhlIGZvcm1EYXRhIChpZiB5b3UgdXNlIEdFVC9ERUxFVEUsIHRoaXMgd2lsbCBiZSBpZ25vcmVkKVxuICAgICAgICBAa2V5IFtmaWxlS2V5XSB7U3RyaW5nfSB0aGUgZm9ybSBrZXkgb2YgdGhlIGZpbGUgaW4gZm9ybSwgZGVmYXVsdCBcImZpbGVcIlxuIyMjXG5cbigoZ2xvYmFsLCBmYWN0b3J5KS0+XG4gICAgaWYgdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyBcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KClcbiAgICBlbHNlXG4gICAgICAgIGlmIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kXG4gICAgICAgICAgICBkZWZpbmUoZmFjdG9yeSkgXG4gICAgICAgIGVsc2UgZ2xvYmFsLlJlcXVlc3RzID0gZmFjdG9yeSgpXG4pKHRoaXMsICgpLT5cblxuICAgIF9fREVCVUdfUkVRVUVTVFMgPSBmYWxzZVxuXG4gICAgY2xhc3MgUmVxdWVzdHNcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGN1c19vcHQpIC0+XG4gICAgICAgICAgICBpZiBub3QgY3VzX29wdCBvciAodHlwZW9mIGN1c19vcHQgPT0gJ29iamVjdCcgYW5kICFjdXNfb3B0LnVybClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ3VybCBpcyBuZWVkZWQhISdcbiAgICAgICAgICAgIEBvcHQgPSB7fVxuICAgICAgICAgICAgQG9wdC51cmwgPSBjdXNfb3B0LnVybCB8fCBjdXNfb3B0XG4gICAgICAgICAgICBAb3B0LnBhcmFtcyA9IGN1c19vcHQucGFyYW1zIHx8IHt9XG4gICAgICAgICAgICBAb3B0LnVybCA9IEBfbWl4VVJMIEBvcHQudXJsLCBAb3B0LnBhcmFtc1xuICAgICAgICAgICAgQG9wdC5mb3JtID0gY3VzX29wdC5mb3JtIHx8IHt9XG4gICAgICAgICAgICBAb3B0LmZpbGVLZXkgPSBjdXNfb3B0LmZpbGVLZXkgfHwgJ2ZpbGUnXG4gICAgICAgICAgICBAY3VzX29wdCA9IGN1c19vcHRcblxuXG4gICAgICAgICMjI1xuICAgICAgICBVc2UgdGhpcyBtZXRob2QgdG8gdXBsb2FkIGEgZmlsZSBkaXJlY3RseS5cbiAgICAgICAgQGV4YW1wbGU6XG4gICAgICAgICAgICBodG1sOlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIG9uY2hhbmdlPVwidXBmaWxlKHRoaXMpXCI+XG4gICAgICAgICAgICBqczpcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB1cGZpbGUoZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBSZXF1ZXN0cyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vc2VydmVyLmNvbTo5MDQwP3VpZD1hZG1pbiZ0b2tlbj1xd2VyI2ppYWppYWppYScsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnd2FoYWhhJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWQ6ZnVuY3Rpb24oYXJncyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdNWSBMT0FEIEhBTkRMRVI6ICcsIGFyZ3MpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6ZnVuY3Rpb24oYXJncyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdNWSBwcm9ncmVzcyBIQU5ETEVSOiAnLCBhcmdzKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS51cGxvYWQoZWxlLmZpbGVzWzBdKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgb3I6XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gdXBmaWxlMihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFJlcXVlc3RzKCdodHRwOi8vc2VydmVyLmNvbTo5MDQwP3VpZD1hZG1pbiZ0b2tlbj1xd2VyI2ppYWppYWppYScpXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBsb2FkKGVsZS5maWxlc1swXSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIEBtZXRob2QgdXBsb2FkXG4gICAgICAgIEBwYXJhbSBmaWxlT2JqIHtGaWxlfSBmaWxlIHlvdSB3YW50IHRvIHVwbG9hZFxuICAgICAgICBAcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAjIyNcbiAgICAgICAgdXBsb2FkOiAoZmlsZU9iaikgPT5cbiAgICAgICAgICAgICMgX2Zvcm0gPSB7fVxuICAgICAgICAgICAgIyAoX2Zvcm1ba10gPSB2KSBmb3IgaywgdiBvZiBAb3B0LmZvcm0gaWYgQG9wdC5mb3JtXG4gICAgICAgICAgICBAb3B0LmZvcm1bQG9wdC5maWxlS2V5XSA9IGZpbGVPYmpcbiAgICAgICAgICAgICMgQF91cGxvYWQoX2Zvcm0pXG4gICAgICAgICAgICBAX2h0dHAoJ3Bvc3QnKVxuICAgICAgICAgICAgcmV0dXJuIEBcblxuXG4gICAgICAgICMjI1xuICAgICAgICBUaGVzZSBmb3VyIG1ldGhvZHMgYXJlIGZvciBoYW5kbGVyIGNhbGxpbmcuXG4gICAgICAgIFRoZXkgd2lsbCBleGVjdXRlIHRoZSBkZWZhdWx0IGhhbmRsZXIgYW5kIHRoZW4gY2FsbCB5b3VyIGhhbmRsZXJzIFxcXG4gICAgICAgIChzZXRlZCBpbiB0aGUgY29uc3RydWN0b3Igb3IgTWV0aG9kIGNoYWluaW5nKS5cbiAgICAgICAgWW91ciBjdXN0b21lciBjYWxsYmFjayBhcmdzIHdpbGwgYmUgbWl4ZWQgaW50byB0aGUgcGFyYW0gb2YgY2FsbGJhY2sgY2FsbGluZywgXFxcbiAgICAgICAgYW5kIGEgd2FybmluZyB3aWxsIGJlIHJhaXNlZCBpZiB0aGVyZSBpcyBhIGtleSBjb25mbGljdFxuXG4gICAgICAgICoqIFlvdSBzaG91bGRuJ3QgdXNlIHRoaXMgdW5sZXNzIGl0J3MgZm9yIGRlYnVnICoqXG5cbiAgICAgICAgQG1ldGhvZCBsb2FkL2Vycm9yL3Byb2dyZXNzL2Fib3J0XG4gICAgICAgIEBwYXJhbSBoYW5kbGVyIHtGdW5jdGlvbn0gXG4gICAgICAgIEByZXR1cm4gdGhpcyB7UmVxdWVzdHN9XG4gICAgICAgICMjI1xuICAgICAgICBfdXBkYXRlUHJvZ3Jlc3M6IChlKT0+ICMgJ3RoaXMnIGhlcmUgbWVhbnMgUmVxdWVzdHMsICdlJyBoZXJlIG1lYW5zIFhNTEh0dHBSZXF1ZXN0UHJvZ3Jlc3NFdmVudFxuICAgICAgICAgICAgIyBpZiBfX0RFQlVHX1JFUVVFU1RTXG4gICAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZyAnX3VwZGF0ZVByb2dyZXNzOiAnLCBAeGhyXG4gICAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZyAnX3VwZGF0ZVByb2dyZXNzOiAnLCBlXG4gICAgICAgICAgICBpZiBlLmxlbmd0aENvbXB1dGFibGVcbiAgICAgICAgICAgICAgICBAb3B0LnVwbG9hZFBlcmNlbnQgPSBlLmxvYWRlZCAvIGUudG90YWxcbiAgICAgICAgICAgIEBjdXNfb3B0LnByb2dyZXNzIChAX2V4dGVuZCB7cHJvZ3Jlc3M6QG9wdC51cGxvYWRQZXJjZW50fSwgQGN1c19vcHQucHJvZ3Jlc3NfYXJnKSBpZiBAY3VzX29wdC5wcm9ncmVzc1xuICAgICAgICBcbiAgICAgICAgX3hock9ubG9hZGVuZDogKGUpPT4gIyAndGhpcycgaGVyZSBtZWFucyB0aGUgUmVxdWVzdHMsICdlJyBoZXJlIG1lYW5zIFhNTEh0dHBSZXF1ZXN0UHJvZ3Jlc3NFdmVudFxuICAgICAgICAgICAgIyBIQUNLOiBsb2FkIGFuZCBlcnJvciBpcyBxdWl0ZSBjb25mdXNpbmdcbiAgICAgICAgICAgICMgc28gd2UgY2hlY2sgdGhlIHhoci5zdGF0dXMgdG8gZGVjaWRlXG4gICAgICAgICAgICBpZiBAeGhyLnN0YXR1cyA+IDM5OVxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybiAneGhyIGZhaWxlZCdcbiAgICAgICAgICAgICAgICBAX3hock9uZXJyb3IoZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSBAeGhyLnJlc3BvbnNlXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciAnbm90IGpzb24hISdcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IEB4aHIucmVzcG9uc2VcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgX19ERUJVR19SRVFVRVNUU1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nICdPbmxvYWQ6IHRoaXM6ICcsIEB4aHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyByZXNwb25zZVxuICAgICAgICAgICAgQGN1c19vcHQubG9hZCAoQF9leHRlbmQgQGN1c19vcHQubG9hZF9hcmcsIHJlc3BvbnNlKSBpZiBAY3VzX29wdC5sb2FkXG5cbiAgICAgICAgX3hock9uZXJyb3I6IChlKT0+ICMgJ3RoaXMnIGhlcmUgbWVhbnMgdGhlIFJlcXVlc3RzLCAnZScgaGVyZSBtZWFucyBYTUxIdHRwUmVxdWVzdFByb2dyZXNzRXZlbnRcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgJ1hIUiBGQUlMRUQnLCBAeGhyXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBfX3Jlc3BvbnNlID0gaWYgQHhoci5yZXNwb25zZSB0aGVuIEpTT04ucGFyc2UgQHhoci5yZXNwb25zZSBlbHNlIHt9XG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgX19yZXNwb25zZSA9IEB4aHIucmVzcG9uc2VcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQGN1c19vcHQuZXJyb3JcbiAgICAgICAgICAgICAgICBAY3VzX29wdC5lcnJvciAoQF9leHRlbmQgQGN1c19vcHQuZXJyb3JfYXJnLCBfX3Jlc3BvbnNlKSBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ1hIUiBGQUlMRUQnXG5cbiAgICAgICAgX3hock9uYWJvcnQ6IChlKT0+ICMgJ3RoaXMnIGhlcmUgbWVhbnMgdGhlIFJlcXVlc3RzLCAnZScgaGVyZSBtZWFucyBYTUxIdHRwUmVxdWVzdFByb2dyZXNzRXZlbnRcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgJ1hIUiBBQk9SVCdcbiAgICAgICAgICAgIEBjdXNfb3B0LmFib3J0IChAY3VzX29wdC5hYm9ydF9hcmcpIGlmIEBjdXNfb3B0LmFib3J0XG5cblxuICAgICAgICAjIyNcbiAgICAgICAgSnVzdCBsaWtlIGpRdWVyeS5leHRlbmQsIG1peCB0b3cgb3IgbW9yZSBvYmplY3RcbiAgICAgICAgKiogU2hhbGxvdyBjb3B5ICoqIFxuXG4gICAgICAgIEBtZXRob2QgX2V4dGVuZFxuICAgICAgICBAcGFyYW0gLi4uIHtPYmplY3R9IFxuICAgICAgICBAcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAjIyNcbiAgICAgICAgX2V4dGVuZDogKCk9PiAjICd0aGlzJyBoZXJlIG1lYW5zIHRoZSBSZXF1ZXN0c1xuICAgICAgICAgICAgX19pZCA9IDBcbiAgICAgICAgICAgIG5ld19vYmogPSB7fVxuICAgICAgICAgICAgZm9yIG9iaiBpbiBhcmd1bWVudHNcbiAgICAgICAgICAgICAgICBpZiB0eXBlb2Ygb2JqID09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgJ2Nhbm5vdCBleHRlbmQgc3RyaW5nISEnXG4gICAgICAgICAgICAgICAgICAgIG5ld19vYmpbJ19fc3RyaW5nXycrX19pZF0gPSBvYmpcbiAgICAgICAgICAgICAgICAgICAgX19pZCArPSAxXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBmb3IgaywgdiBvZiBvYmpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG5ld19vYmpba11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4gJ2V4dGVuZCBjb25mbGljdDogJywgb2JqLCBrXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdfb2JqW2tdID0gdiBcbiAgICAgICAgICAgIHJldHVybiBuZXdfb2JqXG5cblxuICAgICAgICAjIyNcbiAgICAgICAgQWRkIHBhcmFtcyBpbnRvIHF1ZXJ5U3RyaW5nIG9mIFVSTC5cbiAgICAgICAgKiogVGhpcyB3b24ndCBjaGVjayBpZiB0aGUga2V5IGlzIGFscmVhZHkgaW4gdGhlIHF1ZXJ5U3RyaW5nICoqXG5cbiAgICAgICAgQG1ldGhvZCBfbWl4VVJMXG4gICAgICAgIEBwYXJhbSB1cmwge1N0cmluZ30gXG4gICAgICAgIEBwYXJhbSBwYXJhbXMge09iamVjdH0gXG4gICAgICAgIEByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICMjI1xuICAgICAgICBfbWl4VVJMOiAodXJsLCBwYXJhbXMpPT5cbiAgICAgICAgICAgIGlmIHBhcmFtcy5sZW5ndGggIT0gMFxuICAgICAgICAgICAgICAgIHBhcmFtX3N0ciA9ICcnXG4gICAgICAgICAgICAgICAgcGFyYW1fc3RyICs9IGsudG9TdHJpbmcoKSArICc9JyArIHYudG9TdHJpbmcoKSArICcmJyBmb3IgaywgdiBvZiBwYXJhbXNcbiAgICAgICAgICAgICAgICBfX2luZGV4X3F1ZXJ5ID0gdXJsLmluZGV4T2YgJz8nXG4gICAgICAgICAgICAgICAgX19pbmRleF9oYXNoID0gdXJsLmluZGV4T2YgJyMnXG4gICAgICAgICAgICAgICAgaWYgX19pbmRleF9xdWVyeSA8MCBhbmQgX19pbmRleF9oYXNoIDwwXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cmwgKyAnPycgKyBwYXJhbV9zdHIuc2xpY2UgMCwgcGFyYW1fc3RyLmxlbmd0aC0xXG4gICAgICAgICAgICAgICAgaWYgX19pbmRleF9xdWVyeSA8MCBhbmQgX19pbmRleF9oYXNoID49IDBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh1cmwuc2xpY2UgMCwgX19pbmRleF9oYXNoKSArICc/JyArIChwYXJhbV9zdHIuc2xpY2UgMCwgcGFyYW1fc3RyLmxlbmd0aC0xKSArICh1cmwuc2xpY2UgX19pbmRleF9oYXNoKVxuICAgICAgICAgICAgICAgIGlmIF9faW5kZXhfcXVlcnkgPj0wIGFuZCBfX2luZGV4X2hhc2ggPDBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh1cmwuc2xpY2UgMCwgX19pbmRleF9xdWVyeSsxKSArIChwYXJhbV9zdHIpICsgKHVybC5zbGljZSBfX2luZGV4X3F1ZXJ5KzEpXG4gICAgICAgICAgICAgICAgaWYgX19pbmRleF9xdWVyeSA+PTAgYW5kIF9faW5kZXhfaGFzaCA+PTBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh1cmwuc2xpY2UgMCwgX19pbmRleF9xdWVyeSsxKSArIChwYXJhbV9zdHIpICsgKHVybC5zbGljZSBfX2luZGV4X3F1ZXJ5KzEpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVybFxuXG5cbiAgICAgICAgIyMjXG4gICAgICAgIE1ldGhvZCB0aGF0IGhhbmRlbCBhbGwgdGhlIFhIUlxuICAgICAgICAqKiB5b3Ugc2hvdWxkbid0IHVzZSB0aGlzIHVubGVzcyBpdCdzIGZvciBkZWJ1ZyAqKlxuXG4gICAgICAgIEBtZXRob2QgX2h0dHBcbiAgICAgICAgQHBhcmFtIG1ldGhvZCB7U3RyaW5nfSBbZ2V0fHBvc3R8cHV0fGRlbGV0ZV0gICoqIGNhc2UtaW5zZW5zaXRpdmUgKipcbiAgICAgICAgQHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgIyMjXG4gICAgICAgIF9odHRwOiAobWV0aG9kKS0+XG4gICAgICAgICAgICAjIGluaXQgeGhyXG4gICAgICAgICAgICBAeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgICAgIEB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLCBAX3VwZGF0ZVByb2dyZXNzLCBmYWxzZSlcbiAgICAgICAgICAgICMgQHhoci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgQF94aHJPbmVycm9yLCBmYWxzZSlcbiAgICAgICAgICAgICMgQHhoci5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBAX3hock9ubG9hZCwgZmFsc2UpXG4gICAgICAgICAgICBAeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZW5kXCIsIEBfeGhyT25sb2FkZW5kLCBmYWxzZSlcbiAgICAgICAgICAgIEB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIEBfeGhyT25hYm9ydCwgZmFsc2UpXG4gICAgICAgICAgICBAeGhyLm9wZW4obWV0aG9kLCBAb3B0LnVybClcblxuICAgICAgICAgICAgaWYgbWV0aG9kLnRvTG93ZXJDYXNlKCkgPT0gJ3Bvc3QnIG9yIG1ldGhvZC50b0xvd2VyQ2FzZSgpID09ICdwdXQnXG4gICAgICAgICAgICAgICAgIyBpbml0IGZvcm1cbiAgICAgICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgICAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yICd5b3VyIGJyb3dzZXIgaXMgb3V0IGRhdGVkIChmb3JtRGF0YSBub3Qgc3VwcG9ydGVkKSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoaywgdikgZm9yIGssIHYgb2YgQG9wdC5mb3JtIGlmIEBvcHQuZm9ybVxuICAgICAgICAgICAgICAgICMgZm9ybURhdGEuYXBwZW5kKCBAb3B0LmZpbGVLZXksIGZpbGVPYmopXG4gICAgICAgICAgICAgICAgIyBmb3JtRGF0YS5hcHBlbmQoXCJvcmlnaW5hbF9maWxlbmFtZVwiLCBmaWxlT2JqLmZpbGVOYW1lIHx8IGZpbGVPYmoubmFtZSlcblxuICAgICAgICAgICAgICAgICMgc2VuZFxuICAgICAgICAgICAgICAgIEB4aHIuc2VuZChmb3JtRGF0YSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAeGhyLnNlbmQoKVxuXG5cbiAgICAgICAgIyMjXG4gICAgICAgIEBleGFtcGxlOlxuICAgICAgICBuZXcgUmVxdWVzdHMoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL3NlcnZlci5jb206OTA0MD91aWQgPWFkbWluJnRva2VuPXF3ZXInLFxuICAgICAgICAgICAgcGFyYW1zOiB7c3NpZDpcInBpdXBpdXBpXCJ9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGFyZ3Mpe2NvbnNvbGUud2FybignTVkgRVJST1IgSEFORExFUjogJywgYXJncyl9LFxuICAgICAgICAgICAgbG9hZDogZnVuY3Rpb24oYXJncyl7Y29uc29sZS53YXJuKCdNWSBMT0FEIEhBTkRMRVI6ICcsIGFyZ3MpfVxuICAgICAgICB9KS5nZXQoKVxuICAgICAgICBAbWV0aG9kIGdldFxuICAgICAgICBAcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAjIyNcbiAgICAgICAgZ2V0OiAoKS0+XG4gICAgICAgICAgICBAX2h0dHAoJ2dldCcpXG4gICAgICAgICAgICByZXR1cm4gQFxuXG5cbiAgICAgICAgIyMjXG4gICAgICAgIEBleGFtcGxlOlxuICAgICAgICAgICAgbmV3IFJlcXVlc3RzKHtcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vc2VydmVyLmNvbTo5MDQwP3VpZD1hZG1pbiZ0b2tlbj1xd2VyJyxcbiAgICAgICAgICAgICAgICBmb3JtOntcbiAgICAgICAgICAgICAgICAgICAgaGE6XCJoYWhhaGhhXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlaTonaGVpaGllJyxcbiAgICAgICAgICAgICAgICAgICAgZmlsZTplbGUuZmlsZXNbMF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGFyZ3Mpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ01ZIEVSUk9SIEhBTkRMRVI6ICcsIGFyZ3MpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBsb2FkOmZ1bmN0aW9uKGFyZ3Mpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ01ZIExPQUQgSEFORExFUjogJywgYXJncylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByb2dyZXNzOmZ1bmN0aW9uKGFyZ3Mpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ01ZIHByb2dyZXNzIEhBTkRMRVI6ICcsIGFyZ3MpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkucG9zdCgpO1xuICAgICAgICBAbWV0aG9kIHBvc3RcbiAgICAgICAgQHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgIyMjXG4gICAgICAgIHBvc3Q6ICgpLT5cbiAgICAgICAgICAgIEBfaHR0cCgncG9zdCcpXG4gICAgICAgICAgICByZXR1cm4gQFxuXG5cbiAgICAgICAgIyMjXG4gICAgICAgIEBtZXRob2QgcHV0XG4gICAgICAgIEByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICMjI1xuICAgICAgICBwdXQ6ICgpLT5cbiAgICAgICAgICAgIEBfaHR0cCgncHV0JylcbiAgICAgICAgICAgIHJldHVybiBAXG5cblxuICAgICAgICAjIyNcbiAgICAgICAgQG1ldGhvZCBkZWxldGVcbiAgICAgICAgQHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgIyMjXG4gICAgICAgIGRlbGV0ZTogKCktPlxuICAgICAgICAgICAgQF9odHRwKCdkZWxldGUnKVxuICAgICAgICAgICAgcmV0dXJuIEBcblxuXG4gICAgICAgICMjI1xuICAgICAgICBUaGVzZSBmb3VyIG1ldGhvZHMgYXJlIGZvciAqKiBNZXRob2QgY2hhaW5pbmcgKipcbiAgICAgICAgKiogVGhlc2Ugd2lsbCBjb3ZlciB0aGUgZnVuY3Rpb25zIHlvdSBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yIG9wdCAqKlxuXG4gICAgICAgIEBtZXRob2QgbG9hZC9lcnJvci9wcm9ncmVzcy9hYm9ydFxuICAgICAgICBAcGFyYW0gaGFuZGxlciB7RnVuY3Rpb259IFxuICAgICAgICBAcmV0dXJuIHRoaXMge1JlcXVlc3RzfVxuICAgICAgICAjIyNcbiAgICAgICAgbG9hZDogKGxvYWRfaGFuZGxlcik9PlxuICAgICAgICAgICAgQGN1c19vcHQubG9hZCA9IGxvYWRfaGFuZGxlclxuICAgICAgICAgICAgcmV0dXJuIEBcblxuXG4gICAgICAgIGVycm9yOiAoZXJyb3JfaGFuZGxlcik9PlxuICAgICAgICAgICAgQGN1c19vcHQuZXJyb3IgPSBlcnJvcl9oYW5kbGVyXG4gICAgICAgICAgICByZXR1cm4gQFxuXG5cbiAgICAgICAgcHJvZ3Jlc3M6IChwcm9ncmVzc19oYW5kbGVyKT0+XG4gICAgICAgICAgICBAY3VzX29wdC5wcm9ncmVzcyA9IHByb2dyZXNzX2hhbmRsZXJcbiAgICAgICAgICAgIHJldHVybiBAXG5cblxuICAgICAgICBhYm9ydDogKGFib3J0X2hhbmRsZXIpPT5cbiAgICAgICAgICAgIEBjdXNfb3B0LmFib3J0ID0gYWJvcnRfaGFuZGxlclxuICAgICAgICAgICAgcmV0dXJuIEBcbikiXX0=
