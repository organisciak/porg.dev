<section class="prose prose-gray max-w-none dark:prose-invert">
  <p>
    <a href="https://schema.org" target="_blank" rel="noopener noreferrer">Schema.org</a>
    is a collaborative vocabulary for describing entities on the web. It was created by Google,
    Microsoft, Yahoo, and Yandex to help search engines understand web content.
  </p>

  <p>
    Schema.org is built around three key concepts:
  </p>
  <ul>
    <li><strong>Types</strong> &mdash; What kind of thing is it? (e.g. Book, Person, Event). Types are organized in a hierarchy: a <em>Restaurant</em> is a type of <em>LocalBusiness</em>, which is a type of <em>Organization</em>, which is a type of <em>Thing</em>.</li>
    <li><strong>Properties</strong> &mdash; What attributes can it have? Properties are inherited from parent types. A Book has <code>isbn</code> (specific to Book) but also <code>name</code> (inherited from Thing).</li>
    <li><strong>Values</strong> &mdash; What are those attributes set to? Values can be basic data types (Text, Number, Boolean, Date) or other schema.org types (e.g. the <code>author</code> property expects a <code>Person</code>).</li>
  </ul>

  <p>
    Why does this matter for data curation? Schema.org provides a <strong>shared vocabulary</strong> for describing data.
    Rather than every organization inventing their own field names, schema.org gives us a common language that both humans and machines can understand.
  </p>
</section>
