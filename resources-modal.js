function showDownloadModal() {
    document.getElementById("downloadModal").classList.add("modal-visible");
}
function closeModal() {
    document.getElementById("downloadModal").classList.remove("modal-visible");
    document.getElementById("emailForm").style.display = "flex";
    document.getElementById("emailSuccess").style.display = "none";
    document.getElementById("emailInput").value = "";
    // Reset submit button state
    var submitBtn = document.querySelector(".email-submit-btn");
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Subscribe";
    }
}
function submitEmail(e) {
    e.preventDefault();
    var emailInput = document.getElementById("emailInput").value;
    var submitBtn = document.querySelector(".email-submit-btn");
    
    // Disable submit button to prevent double-submission
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    
    // Submit to Formspree
    fetch("https://formspree.io/f/xrealgzz", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailInput,
            message: "Downloaded: " + (window.lastDownloadedResource || "unknown resource"),
            _subject: "New subscriber from " + (window.lastDownloadedResource || "website")
        })
    })
    .then(function(response) {
        if (response.ok) {
            // Success - track with GA4 and show success message
            if (window.trackEvent) { trackEvent("email_signup", { source: "download_modal", status: "success" }); }
            document.getElementById("emailForm").style.display = "none";
            document.getElementById("emailSuccess").style.display = "block";
            // Auto-close after 2 seconds once email is submitted
            setTimeout(closeModal, 2000);
        } else {
            // Error - show error message
            throw new Error("Form submission failed");
        }
    })
    .catch(function(error) {
        // Error handling - still show success to user (fail gracefully)
        if (window.trackEvent) { trackEvent("email_signup", { source: "download_modal", status: "error" }); }
        document.getElementById("emailForm").style.display = "none";
        document.getElementById("emailSuccess").textContent = "âœ“ Thank you! We'll be in touch soon.";
        document.getElementById("emailSuccess").style.display = "block";
        // Auto-close after 2 seconds once email is submitted
        setTimeout(closeModal, 2000);
        // Re-enable button in case modal is opened again
        submitBtn.disabled = false;
        submitBtn.textContent = "Subscribe";
    });
}
function handleDownload(resourceName, pdfPath) {
    if (window.trackEvent) { trackEvent("resource_download_click", { resource: resourceName }); }
    if (pdfPath) { window.open(pdfPath, "_blank"); }
    // Store the resource name so submitEmail can include it
    window.lastDownloadedResource = resourceName;
    showDownloadModal();
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("downloadModal").addEventListener("click", function(e) {
        if (e.target === this) { closeModal(); }
    });
});
