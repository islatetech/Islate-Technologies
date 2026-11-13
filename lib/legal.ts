/**
 * Legal text from https://islate.in (privacy-policy and refund_returns).
 * The client's wording is kept as it was, with three agreed edits: the
 * "Suggested text:" labels and the "This is a sample page." line are removed,
 * and the empty placeholders are filled with the company's email and address.
 * Do not change any other wording here without the client's approval.
 */

export type LegalBlock =
  | { t: "h2" | "h3" | "p"; html: string }
  | { t: "ul" | "ol"; items: string[] };

export const privacyPolicy: LegalBlock[] = [
  {
    "t": "h2",
    "html": "Who we are"
  },
  {
    "t": "p",
    "html": "Our website address is: https://islate.in."
  },
  {
    "t": "h2",
    "html": "Comments"
  },
  {
    "t": "p",
    "html": "When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection."
  },
  {
    "t": "p",
    "html": "An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment."
  },
  {
    "t": "h2",
    "html": "Media"
  },
  {
    "t": "p",
    "html": "If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website."
  },
  {
    "t": "h2",
    "html": "Cookies"
  },
  {
    "t": "p",
    "html": "If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year."
  },
  {
    "t": "p",
    "html": "If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser."
  },
  {
    "t": "p",
    "html": "When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select &quot;Remember Me&quot;, your login will persist for two weeks. If you log out of your account, the login cookies will be removed."
  },
  {
    "t": "p",
    "html": "If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day."
  },
  {
    "t": "h2",
    "html": "Embedded content from other websites"
  },
  {
    "t": "p",
    "html": "Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website."
  },
  {
    "t": "p",
    "html": "These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website."
  },
  {
    "t": "h2",
    "html": "Who we share your data with"
  },
  {
    "t": "p",
    "html": "If you request a password reset, your IP address will be included in the reset email."
  },
  {
    "t": "h2",
    "html": "How long we retain your data"
  },
  {
    "t": "p",
    "html": "If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue."
  },
  {
    "t": "p",
    "html": "For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information."
  },
  {
    "t": "h2",
    "html": "What rights you have over your data"
  },
  {
    "t": "p",
    "html": "If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes."
  },
  {
    "t": "h2",
    "html": "Where your data is sent"
  },
  {
    "t": "p",
    "html": "Visitor comments may be checked through an automated spam detection service."
  }
];

export const refundPolicy: LegalBlock[] = [
  {
    "t": "h2",
    "html": "Overview"
  },
  {
    "t": "p",
    "html": "Our refund and returns policy lasts 30 days. If 30 days have passed since your purchase, we can’t offer you a full refund or exchange."
  },
  {
    "t": "p",
    "html": "To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging."
  },
  {
    "t": "p",
    "html": "Several types of goods are exempt from being returned. Perishable goods such as food, flowers, newspapers or magazines cannot be returned. We also do not accept products that are intimate or sanitary goods, hazardous materials, or flammable liquids or gases."
  },
  {
    "t": "p",
    "html": "Additional non-returnable items:"
  },
  {
    "t": "ul",
    "items": [
      "Gift cards",
      "Downloadable software products",
      "Some health and personal care items"
    ]
  },
  {
    "t": "p",
    "html": "To complete your return, we require a receipt or proof of purchase."
  },
  {
    "t": "p",
    "html": "Please do not send your purchase back to the manufacturer."
  },
  {
    "t": "p",
    "html": "There are certain situations where only partial refunds are granted:"
  },
  {
    "t": "ul",
    "items": [
      "Book with obvious signs of use",
      "CD, DVD, VHS tape, software, video game, cassette tape, or vinyl record that has been opened.",
      "Any item not in its original condition, is damaged or missing parts for reasons not due to our error.",
      "Any item that is returned more than 30 days after delivery"
    ]
  },
  {
    "t": "h2",
    "html": "Refunds"
  },
  {
    "t": "p",
    "html": "Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund."
  },
  {
    "t": "p",
    "html": "If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days."
  },
  {
    "t": "h3",
    "html": "Late or missing refunds"
  },
  {
    "t": "p",
    "html": "If you haven’t received a refund yet, first check your bank account again."
  },
  {
    "t": "p",
    "html": "Then contact your credit card company, it may take some time before your refund is officially posted."
  },
  {
    "t": "p",
    "html": "Next contact your bank. There is often some processing time before a refund is posted."
  },
  {
    "t": "p",
    "html": "If you’ve done all of this and you still have not received your refund yet, please contact us at info@islate.in."
  },
  {
    "t": "h3",
    "html": "Sale items"
  },
  {
    "t": "p",
    "html": "Only regular priced items may be refunded. Sale items cannot be refunded."
  },
  {
    "t": "h2",
    "html": "Exchanges"
  },
  {
    "t": "p",
    "html": "We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at info@islate.in and send your item to: B-05, B Block, Sector 64, Noida, Uttar Pradesh 201301."
  },
  {
    "t": "h2",
    "html": "Gifts"
  },
  {
    "t": "p",
    "html": "If the item was marked as a gift when purchased and shipped directly to you, you’ll receive a gift credit for the value of your return. Once the returned item is received, a gift certificate will be mailed to you."
  },
  {
    "t": "p",
    "html": "If the item wasn’t marked as a gift when purchased, or the gift giver had the order shipped to themselves to give to you later, we will send a refund to the gift giver and they will find out about your return."
  },
  {
    "t": "h2",
    "html": "Shipping returns"
  },
  {
    "t": "p",
    "html": "To return your product, you should mail your product to: B-05, B Block, Sector 64, Noida, Uttar Pradesh 201301."
  },
  {
    "t": "p",
    "html": "You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund."
  },
  {
    "t": "p",
    "html": "Depending on where you live, the time it may take for your exchanged product to reach you may vary."
  },
  {
    "t": "p",
    "html": "If you are returning more expensive items, you may consider using a trackable shipping service or purchasing shipping insurance. We don’t guarantee that we will receive your returned item."
  },
  {
    "t": "h2",
    "html": "Need help?"
  },
  {
    "t": "p",
    "html": "Contact us at info@islate.in for questions related to refunds and returns."
  }
];
