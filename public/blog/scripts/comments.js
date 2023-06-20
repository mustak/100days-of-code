const loadCommentsBtn = document.getElementById('load-comments-btn');
const commentsSectionElement = document.getElementById('comments');
const commentsFormElement = document.getElementById('commentsForm');

loadCommentsBtn.addEventListener('click', handleLoadComments);
commentsFormElement.addEventListener('submit', handleFormSubmission);

async function handleLoadComments() {
    const postID = loadCommentsBtn.dataset.postid;

    try {
        const response = await fetch(`${postID}/comments`);

        if (!response.ok) {
            console.log(`${response.status}, ${response.statusText}`);
            return;
        } //if (!response.ok)

        const result = await response.json();

        if (result.comments && result.comments.length > 0) {
            const commentsList = generateList(result.comments);
            commentsSectionElement.innerHTML = '';
            commentsSectionElement.appendChild(commentsList);
        } else {
            commentsSectionElement.firstElementChild.textContent = `There are no comments for this post. May be you can add one. ${result.message}`;
        }
    } catch (error) {
        console.log(error);
    }
}

function generateList(comments) {
    const list = document.createElement('ul');

    comments.forEach((comment) => {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
		<article class="comment-item">
			<h2>${comment.title}</h2>
			<p>${comment.text}</p>
		</article>
		`;

        list.appendChild(listItem);
    });

    return list;
}

async function handleFormSubmission(event) {
    event.preventDefault();

    const postID = commentsFormElement.dataset.postid;
    const title = document.getElementById('title');
    const text = document.getElementById('text');

    const newComment = {
        title: title.value,
        text: text.value,
    };

    try {
        const response = await fetch(`${postID}/comments`, {
            method: 'POST',
            body: JSON.stringify(newComment),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log('response not OK');
            return;
        }
        const result = await response.json();

        title.value = '';
        text.value = '';
        handleLoadComments();
    } catch (error) {
        console.log(error);
    }
}
