
/**
 * DASHBOARD 
 * @author Meng G.
 * @description part of SQIP
 *
 * @requires helpers
 * @requires vue, requests
 */
var _API_SERVER_;

console.log('login deving.....');

_API_SERVER_ = 'http://127.0.0.1:9032/';

document.getElementById('login').onclick = function() {
  var pwd, uid;
  uid = document.getElementById('uid').value;
  pwd = document.getElementById('pwd').value;
  console.log(uid, pwd);
  return new Requests({
    url: _API_SERVER_ + 'api/v1/user/login',
    form: {
      uid: uid,
      pwd: pwd
    },
    load: function(args) {
      console.log(args);
      setCookie('uid', args.uid, 'd1');
      setCookie('token', args.token, 'd1');
      return redirect('/');
    },
    error: function(args) {
      console.log(args);
      return alert(args.error_msg);
    }
  }).post();
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7O0FBQUEsSUFBQTs7QUFTQSxPQUFPLENBQUMsR0FBUixDQUFZLG1CQUFaOztBQUVBLFlBQUEsR0FBZTs7QUFFZixRQUFRLENBQUMsY0FBVCxDQUF3QixPQUF4QixDQUFnQyxDQUFDLE9BQWpDLEdBQTJDLFNBQUE7QUFDMUMsTUFBQTtFQUFBLEdBQUEsR0FBTSxRQUFRLENBQUMsY0FBVCxDQUF3QixLQUF4QixDQUE4QixDQUFDO0VBQ3JDLEdBQUEsR0FBTSxRQUFRLENBQUMsY0FBVCxDQUF3QixLQUF4QixDQUE4QixDQUFDO0VBQ3JDLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBWixFQUFpQixHQUFqQjtTQUNJLElBQUEsUUFBQSxDQUFTO0lBQ1osR0FBQSxFQUFLLFlBQUEsR0FBZSxtQkFEUjtJQUVaLElBQUEsRUFBTTtNQUFDLEdBQUEsRUFBSSxHQUFMO01BQVUsR0FBQSxFQUFJLEdBQWQ7S0FGTTtJQUdaLElBQUEsRUFBTSxTQUFDLElBQUQ7TUFDTCxPQUFPLENBQUMsR0FBUixDQUFZLElBQVo7TUFDQSxTQUFBLENBQVUsS0FBVixFQUFpQixJQUFJLENBQUMsR0FBdEIsRUFBMkIsSUFBM0I7TUFDQSxTQUFBLENBQVUsT0FBVixFQUFtQixJQUFJLENBQUMsS0FBeEIsRUFBK0IsSUFBL0I7YUFDQSxRQUFBLENBQVMsR0FBVDtJQUpLLENBSE07SUFRWixLQUFBLEVBQU8sU0FBQyxJQUFEO01BQ04sT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaO2FBQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYO0lBRk0sQ0FSSztHQUFULENBV0QsQ0FBQyxJQVhBLENBQUE7QUFKc0MiLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyIjIyMqXG4gKiBEQVNIQk9BUkQgXG4gKiBAYXV0aG9yIE1lbmcgRy5cbiAqIEBkZXNjcmlwdGlvbiBwYXJ0IG9mIFNRSVBcbiAqXG4gKiBAcmVxdWlyZXMgaGVscGVyc1xuICogQHJlcXVpcmVzIHZ1ZSwgcmVxdWVzdHNcbiMjI1xuXG5jb25zb2xlLmxvZyAnbG9naW4gZGV2aW5nLi4uLi4nXG5cbl9BUElfU0VSVkVSXyA9ICdodHRwOi8vMTI3LjAuMC4xOjkwMzIvJ1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW4nKS5vbmNsaWNrID0gKCktPlxuXHR1aWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndWlkJykudmFsdWVcblx0cHdkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B3ZCcpLnZhbHVlXG5cdGNvbnNvbGUubG9nIHVpZCwgcHdkXG5cdG5ldyBSZXF1ZXN0cyh7XG5cdFx0dXJsOiBfQVBJX1NFUlZFUl8gKyAnYXBpL3YxL3VzZXIvbG9naW4nXG5cdFx0Zm9ybToge3VpZDp1aWQsIHB3ZDpwd2R9XG5cdFx0bG9hZDogKGFyZ3MpLT5cblx0XHRcdGNvbnNvbGUubG9nIGFyZ3Ncblx0XHRcdHNldENvb2tpZSAndWlkJywgYXJncy51aWQsICdkMSdcblx0XHRcdHNldENvb2tpZSAndG9rZW4nLCBhcmdzLnRva2VuLCAnZDEnXG5cdFx0XHRyZWRpcmVjdCAnLydcblx0XHRlcnJvcjogKGFyZ3MpLT5cblx0XHRcdGNvbnNvbGUubG9nIGFyZ3Ncblx0XHRcdGFsZXJ0IGFyZ3MuZXJyb3JfbXNnXG5cdFx0fSkucG9zdCgpXG5cblxuXG5cbiJdfQ==