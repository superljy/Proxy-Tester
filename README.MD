# Proxy_Tester 
_目前是只运行在node上,没有UI界面_
----

## 使用方法
> - 将想要测试的proxy放入`proxies/proxies.txt`中
> - 自行新建`.env`文件,作为环境变量,控制测试的对应网站和希望筛选多少延迟以下的proxy
> - `.env`内全部用`大写`的英文字母,建立`TESTING_SITE`和`DELAY`这两个变量
> - `TESTING_SITE`的值表示需要测试的网站,目前支持如下网站:
>   - `kith`表示 `www.kith.com`
>   - `ys`表示 `www.yeezysupply.com`
>   - `supreme`表示 `www.supremenewyork.com`
>   - `footlocker`表示 `www.footlocker.com`
>   - `nike`表示 `www.nike.com`
>   - 随便填写表示测试`google`的延迟
> - `DELAY`表示你希望筛选走高于这个delay值的proxy 自行填入 默认1500ms
> - 测试完毕后,会自动将延迟低于`DELAY`的proxy重新写入到`filted-proxies.txt`文件中,高于的自动删除