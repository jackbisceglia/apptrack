import unittest
import lambda_function as lf

def create_postings_from_range(start, end):
    result = []
    for i in range(start, end):
        posting = {'url': str(i), 'title': 'posting' + str(i)}
        result.append(posting)
    return result

def create_recipients(num_interns, num_new_grads, num_both):
    interns = []
    for i in range(num_interns):
        recipient = {
            'email': 'recipient' + str(i) + '@example.com',
            'preferenceList': 'INTERN'
        }
        interns.append(recipient)
    new_grads = []
    for i in range(num_new_grads):
        recipient = {
            'email': 'recipient' + str(i) + '@example.com',
            'preferenceList': 'NEWGRAD'
        }
        new_grads.append(recipient)
    both = []
    for i in range(num_both):
        recipient = {
            'email': 'recipient' + str(i) + '@example.com',
            'preferenceList': 'BOTH'
        }
        both.append(recipient)
    return (interns + new_grads + both, interns, new_grads, both)

class TestLambda(unittest.TestCase):
    
    def test_get_new_postings(self):
        # setup
        postings_list_a1 = create_postings_from_range(0, 8)
        postings_list_a2 = create_postings_from_range(0, 8)
        postings_list_b = create_postings_from_range(0, 6)
        postings_list_c = create_postings_from_range(2, 11)
        
        # tests
        self.assertEqual(len(lf.get_new_postings(postings_list_a1, postings_list_a2)), 0)
        self.assertEqual(len(lf.get_new_postings(postings_list_a1, postings_list_b)), 0)
        self.assertEqual(len(lf.get_new_postings(postings_list_b, postings_list_a1)), 2)
        self.assertEqual(len(lf.get_new_postings(postings_list_a1, postings_list_c)), 3)
    
    def test_filter_recipients(self):
        # setup
        everyone, interns, new_grads, both = create_recipients(8, 4, 2)
        self.assertEqual(lf.filter_recipients(everyone, lf.Users.INTERN), interns)
        self.assertEqual(lf.filter_recipients(everyone, lf.Users.NEW_GRAD), new_grads)
        self.assertEqual(lf.filter_recipients(everyone, lf.Users.BOTH), both)
        self.assertEqual(len(lf.filter_recipients(interns, lf.Users.BOTH)), 0)
        
            

if __name__ == '__main__':
    unittest.main()