# jQuery TagHead

###### A *magic* mix between a input tag system, and a typehead engine.

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
										}));
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
										}));
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

### ToDo List

* Default value
* Custom events
* Write a nice documentation
* Unit testing
* Make a decent CSS for the demo

*To be continued...*
