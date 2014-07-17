# jQuery TagHead

###### A *magical* mix between an input tag system, and a typahead engine.

### Usage

#### Basic
```html
<input type="text" id="myInput">
<script>
  $(function() {
    $("#myInput").taghead();
  });
</script>
```

#### Default value
```html
<input type="text" id="myInput" value="1,2,3" data-tags="Label 1,Label 2,Label 3">
<script>
  $(function() {
    $("#myInput").taghead();
  });
</script>
```


#### Remote source

```html
<input type="text" id="myInput">
<script>
  $(function() {
    $("#myInput").taghead({	
				remote: {
					enable: true,
					source: "data.json",
					displayData: 'name',
					storeData: 'id',
					saveData: 'id'
					}
			});
  });
</script>
```


#### Custom CSS

```html
<input type="text" id="myInput">
<script>
  $(function() {
    $("#myInput").taghead({	
				style: {
					wrapperClass: 'custom-wrapper',
					tagClass: 'custom-tag',
					tagListWrapperClass: 'custom-tag-list-wrapper',
					tagListClass: 'custom-tag-list-wrapper'
					tagListItemClass: 'custom-tag-list-item'
					inputClass: 'custom-input'
					removeClass: 'custom-remove'
					}
			});
  });
</script>
```


### Configuration

* `remote`
  * `enable: boolean`
  * `source: string`
  * `method: 'GET' or 'POST'`
  * `sentParam: string`
  * `displayData: string`
  * `storeData: string`
  * `minLength: number`
  * `forceValid: boolean`
* `allowDuplicates: boolean`
* `style`
  * `wrapperClass: string`
  * `tagClass: string`
  * `tagListWrapperClass: string`
  * `tagListClass: string`
  * `tagListItemClass: string`
  * `inputClass: string`
  * `removeClass: string`
* `text`
  * `phAddTag: string`


### Events

* `taghead.remoteresponse`
* `taghead.clicktoadd`
* `taghead.addtag`
* `taghead.removetag`


### ToDo List

* Write a nice documentation
* Unit testing
* Make a decent CSS for the demo

*To be continued...*
