$(document).ready(function () {

    $('.save').click(function () {

        console.log('clicked');
        var id = this.id;

        console.log(id);

        $.get(`/save/true/${id}`, function(data) {
            location.reload();
        });

    });

    $('.remove').click(function(){

        var id = this.id;

        $.get(`/save/false/${id}`, function(data){
            location.reload();
        });

    });

    $('.launch').click(function(){

        var id = $(this).data('id');

        console.log(id);

        $.get(`/comments/${id}`, function(data){

            $('.modal-title').text(data.title);
            $('.postComment').data('id', id)

            console.log(data);

            if(data.comments){
                data.comments.forEach(function(comment){
                    $('<div>').text(comment).appendTo('#commentWindow')
                })
            }

            $('#commentsModal').modal('show');

        })

    });

    $('.closeModal').click(function(){

        $('#commentsModal').modal('hide');

    });

    $('.postComment').click(function(){

        var text = $('#enterComment').val().trim();

        $('<div>').text(text).appendTo('#commentWindow');

        $('#enterComment').val('')

        $('#commentWindow').scrollTop($('#commentWindow')[0].scrollHeight)

        var articleId = $(this).data('id');

        console.log(articleId);

        $.post(`/comments/${articleId}`, {body:text}, function(data){
            console.log(data);
        })

    })

});