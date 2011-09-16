function Selector(elem, selector){

  //Base Selector
  var Selector = {
    template : [
      '<div id="selector">',
        '<div class="thumbnail">',
          '<div class="controls">',
            '<a class="left" href="#">&#9664;</a>',
            '<a class="right" href="#">&#9654;</a>',
            '<a class="nothumb" href="#">&#10005;</a>',
          '</div>',
          '<div class="items">',
            '<ul class="images"></ul>',
          '</div>',
        '</div>',
        '<div class="attributes">',
          '<a class="title" href="#"></a>',
          '<p><a class="description" href="#"></a></p>',
          '<span class="meta">',
            '<img class="favicon" src="">',
            '<a class="provider"></a>',
          '</span>',
        '</div>',
        '<div class="action"><a href="#" class="close">&#10005;</a></div>',
      '</div>'].join(''),

    // If a developer wants complete control of the selector, they can
    // override the render function.
    render : function(obj){
      
      // If the #selector ID is there then replace it with the template. Just
      // tells us where it should be on the page.
      if ($('#selector').length){
        $('#selector').replaceWith(this.template)
      } else {
        elem.append(this.template);
      }

      //Sets all the values in the template.
      $('#selector .title').text(obj.title);
      $('#selector .description').text(obj.description);
      $('#selector .favicon').attr('src', obj.favicon_url);

      $('#selector .provider').attr('href', obj.provider_url);
      $('#selector .provider').text(obj.provider_display);

      _.each(obj.images, function(i){
        $('#selector .images').append('<li><img src="'+i.url+'" /></li>');
      });
      
      if (obj.images.length > 0){
        $('#id_thumbnail_url').val(encodeURIComponent(obj.images[0].url));
      } else{
         $('#selector .thumbnail').hide();
      }
      
      if (obj.images.length == 1){
        $('.controls .left, .controls .right').hide();
      }

      this.bind();
    },
    //Clears the selector post submit.
    clear : function(){    
      $('#selector').html('');
      $('.preview_input').remove();
    },
    scroll : function(dir, e){
      e.preventDefault();

      //Grabs the current 'left' style
      var width = parseInt($('#selector .thumbnail').css('width'));

      // Left
      var left = parseInt($('#selector .images').css('left'));
      //Gets the number of images
      var len = $('#selector .images img').length * width;

      //General logic to set the new left value
      if (dir == 'left'){
        left = parseInt(left)+width;
      if (left > 0) return false;
      } else if (dir == 'right'){
        left = parseInt(left)-width;
      if (left <= -len) return false;
      } else {
        log('not a valid direction: '+dir)
      return false;
      }
      
      var thumb = encodeURIComponent($('#selector .images img').eq((left/-100)).attr('src'));
      
      //  Puts the current thumbnail into the thumbnail_url input
      $('#id_thumbnail_url').val(thumb);

      // Sets the new left.
      $('.images').css('left',left+'px');
    },
    nothumb : function(e){
      e.preventDefault(); 
      $('#selector .thumbnail').hide();
      $('#id_thumbnail_url').val('');
    },
    // When a user wants to Edit a title or description we need to switch out
    // an input or text area
    title : function(e){
      e.preventDefault();      
      //overwrite the a tag with the value of the tag.
      var elem = $('<input/>').attr({
        'value' : $(e.target).text(),
        'class' : 'title',
        'type' : 'text'
        });
      
      $(e.target).replaceWith(elem);

      //Set the focus on this element
      elem.focus();

      // puts the a tag back on blur. It's a single bind so it will be
      // trashed on blur.
      elem.one('blur', function(e){
        var elem = $(e.target);
        // Sets the New Title in the hidden inputs
        $('#id_title').val(encodeURIComponent(elem.val()));
        
        $(e.target).replaceWith($('<a/>').attr(
          {
            'class':'title',
            'href' : '#'
          }).text(elem.val())
        );
      });  
    },
    //Same as before, but for description
    description : function(e){
      e.preventDefault();      
      //overwrite the a tag with the value of the tag.
      var elem = $('<textarea/>').attr({
        'class' : 'description',
        }).text($(e.target).text());

      $(e.target).replaceWith(elem);

      //Set the focus on this element
      elem.focus();

      // puts the a tag back on blur. It's a single bind so it will be
      // trashed on blur.
      elem.one('blur', function(e){
        var elem = $(e.target);
        // Sets the New Title in the hidden inputs
        $('#id_title').val(encodeURIComponent(elem.val()));

        $(e.target).replaceWith($('<a/>').attr(
          {
            'class':'description',
            'href' : '#'
          }).text(elem.val())
        );
      });  
    },
    // Binds the correct events for the controls.
    bind : function(){  

      // Thumbnail Controls
      $('#selector .controls .left').bind('click', _.bind(this.scroll, {}, 'left'));
      $('#selector .controls .right').bind('click', _.bind(this.scroll, {}, 'right'));
      $('#selector .controls .nothumb').bind('click', this.nothumb);
      
      // Binds the close button.
      $('#selector .action .close').live('click', this.clear);
      $('#selector').live('mouseenter mouseleave', function(){
        $('#selector .action').toggle();
      });
      
      //Show hide the controls.
      $('#selector .thumbnail').one('mouseenter', function(){
        $('#selector .thumbnail').bind('mouseenter mouseleave', function(){ $('#selector .thumbnail .controls').toggle();});
      });

      //Edit Title and Description handlers.
      $('#selector .attributes .title').live('click', this.title);
      $('#selector .attributes .description').live('click', this.description);
    }
  }

  _.bindAll(Selector);
  return Selector;
}