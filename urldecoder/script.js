function decodeLink() {
	const encodedLink = document.getElementById("encodedLink").value;
	const decodedLink = decodeURIComponent(encodedLink);
	document.getElementById("decodedLink").textContent = decodedLink;
	document.getElementById("copyBtn").style.display = "inline-block";
}

function copyLink() {
	const decodedLink = document.getElementById("decodedLink").textContent;
	const textarea = document.createElement("textarea");
	textarea.value = decodedLink;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	document.body.removeChild(textarea);
	alert("Copied to clipboard!");
}

