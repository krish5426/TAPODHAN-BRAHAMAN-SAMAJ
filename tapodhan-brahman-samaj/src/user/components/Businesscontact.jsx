import React, { useState, useEffect } from 'react';


export default function Businesscontact() {
  return (
    <>

<section class="business-directory">
  <div class="directory-container">

    <!-- HEADER -->
    <div class="directory-header">
      <span class="directory-tag">BUSINESS GROW</span>
      <h1 class="directory-title">
        Connecting <span>Businesses</span>.<br />
        Creating <span>Growth</span>.
      </h1>

      <div class="directory-actions">
        <input type="text" placeholder="Search By Location" />
        <input type="text" placeholder="Search By Industry" />
        <button class="add-register-btn">Add Register 1</button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="directory-table-wrapper">
      <table class="directory-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Business Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Owner</th>
            <th>Phone</th>
            <th>Creative</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Zero Designs PVT LTD</td>
            <td>IT Service</td>
            <td>Bopal, Ahmedabad</td>
            <td>Hiren Raval</td>
            <td>91 1234567890</td>
            <td class="creative-icon">⬆</td>
          </tr>

          <tr class="active-row">
            <td>2</td>
            <td>New Supremo Dresses</td>
            <td>Clothing Shop</td>
            <td>Mehsana</td>
            <td>Lorem Ipsum</td>
            <td>91 1234567890</td>
            <td class="creative-icon">⬆</td>
          </tr>

          <tr>
            <td>3</td>
            <td>Zero Designs PVT LTD</td>
            <td>IT Service</td>
            <td>Bopal, Ahmedabad</td>
            <td>Hiren Raval</td>
            <td>91 1234567890</td>
            <td class="creative-icon">⬆</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div class="directory-pagination">
      <button>&laquo;</button>
      <button class="active">1</button>
      <button>2</button>
      <button>3</button>
      <span>...</span>
      <button>10</button>
      <button>&raquo;</button>
    </div>

  </div>
</section>

    </>
  );
}
