# jQuery TagHead v0.5.0

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
					storeData: 'id'
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
					tagListClass: 'custom-tag-list-wrapper',
					tagListItemClass: 'custom-tag-list-item',
					inputClass: 'custom-input'
					}
			});
  });
</script>
```


### Configuration

* `remote`
  * `enable: boolean (default: false)`
  * `source: string (default: '')`
  * `method: 'GET' or 'POST' (default: 'GET')`
  * `sentParam: string (default: 'value')`
  * `displayData: string (default: 'value')`
  * `storeData: string (default: 'value')`
  * `minLength: number (default: 2)`
  * `forceValid: boolean (default: false)`
* `allowDuplicates: boolean (default: false)`
* `style`
  * `wrapperClass: string (default: '')`
  * `tagClass: string (default: '')`
  * `tagListWrapperClass: string (default: '')`
  * `tagListClass: string (default: '')`
  * `tagListItemClass: string (default: '')`
  * `inputClass: string (default: '')`
* `text`
  * `phAddTag: string (default: 'Add a tag')`


### Public methods

* `addTag(label, id)`
* `removeTag(label[, id])`
* `clearTag()`


### Events

* `th.remoteresponse`
* `th.clicktoadd`
* `th.addtag`
* `th.removetag`


### ToDo List

* Write a nice documentation
* Unit testing
* Make a real demo

*To be continued...*

### Thanks

* [Flat-UI](http://designmodo.github.io/Flat-UI/)
* [jQuery Boilerplate](http://jqueryboilerplate.com/)
